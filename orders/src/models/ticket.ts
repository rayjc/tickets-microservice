import mongoose from 'mongoose';
import { TicketDoc } from './TicketDoc';
import { OrderStatus } from '@rayjc-dev/common';
import { Order } from './order';

interface TicketAttrs {
  title: string;
  price: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  make(attrs: TicketAttrs): TicketDoc;
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

ticketSchema.statics.make = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
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