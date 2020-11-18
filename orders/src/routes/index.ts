import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError, BadRequestError } from '@rayjc-dev/common';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  // note current user should be embedded in request by middleware
  const orders = await Order.find({
    userId: req.currentUser!.id
  })
  .populate('ticket');
  
  return res.json(orders);
});

export { router as indexOrderRouter };