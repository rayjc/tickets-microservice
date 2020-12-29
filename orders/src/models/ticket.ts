import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { TicketDoc } from './TicketDoc';
import { OrderStatus } from '@rayjc-dev/common';
import { Order } from './order';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  make(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: { id: string, version: number; }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.make = (attrs: TicketAttrs) => {
  const { id, ...remainingAttrs } = attrs;
  // store id as _id
  return new Ticket({
    _id: id,
    ...remainingAttrs
  });
};

ticketSchema.statics.findByEvent = (event: { id: string, version: number; }) => {
  return Ticket.findOne({
    _id: event.id,
    // look for appropriate version, ie. the previous version commited
    version: event.version - 1,
  });
};

ticketSchema.methods.isReserved = async function () {
  // note: need to create new scope for 'this'
  // this === the ticket document that isReserved is called on

  // check for existing order where status is not cancelled
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };