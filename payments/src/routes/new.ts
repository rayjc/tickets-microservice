import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@rayjc-dev/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { stripe } from '../stripe';

const router = express.Router();

router.post('/api/payments',
  requireAuth,
  [
    body('token')
      .not()
      .isEmpty()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order');
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,  // convert to cents
      source: token
    });

    const payment = Payment.make({
      orderId,
      stripeId: charge.id
    });
    await payment.save();

    res.status(201).json({ success: true });
  }
);

export { router as createChargeRouter };