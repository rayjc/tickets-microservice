import express, { Request, Response } from 'express';
import { requireAuth, OrderStatus, NotFoundError, NotAuthorizedError } from '@rayjc-dev/common';
import { Order } from '../models/order';

const router = express.Router();

router.patch('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  // TODO: publish event

  res.json(order);
});

export { router as cancelOrderRouter };