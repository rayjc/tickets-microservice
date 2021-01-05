import { OrderStatus } from '@rayjc-dev/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttrs {
  id: string,
  version: number;
  userId: string,
  price: number;
  status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  make(attrs: OrderAttrs): OrderDoc;
  findByEvent(event: { id: string, version: number; }): Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.make = (attrs: OrderAttrs) => {
  const { id, ...remainingAttrs } = attrs;
  // store id as _id
  return new Order({
    _id: id,
    ...remainingAttrs
  });
};

orderSchema.statics.findByEvent = (event: { id: string, version: number; }) => {
  return Order.findOne({
    _id: event.id,
    // look for appropriate version, ie. the previous version commited
    version: event.version - 1,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };