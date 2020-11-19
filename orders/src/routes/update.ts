import express, { Request, Response } from 'express';
import { requireAuth, OrderStatus, NotFoundError, NotAuthorizedError } from '@rayjc-dev/common';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/OrderCancelledPublisher';
import { natsWrapper } from '../NatsWrapper';

const router = express.Router();

router.patch('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  // publish event
  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id,
    }
  });

  res.json(order);
});

export { router as cancelOrderRouter };