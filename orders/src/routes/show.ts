import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError, NotAuthorizedError } from '@rayjc-dev/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('ticket');
  // check if order exists
  if (!order) {
    throw new NotFoundError();
  }
  // check if user owns the order
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError;
  }

  res.json(order);
});

export { router as showOrderRouter };