import mongoose from 'mongoose';

export interface TicketDoc extends mongoose.Document {
  id: string; // stored as _id; retrieved as id due to transform()
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}