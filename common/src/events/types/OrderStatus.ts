export enum OrderStatus {
  // used when the order has been created,
  // but ticket has not been reserved
  Created = 'created',

  // The ticket has either been reserve
  // or order has been cancelled
  // or order has expired
  Cancelled = 'cancelled',

  // reserved successfully
  AwaitingPayment = 'awaiting:payment',

  // reserved and paid
  Complete = 'complete',
}