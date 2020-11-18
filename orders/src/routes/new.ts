import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from '@rayjc-dev/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { EXPIRATION_WINDOW_SECONDS } from '../config';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      // this check is only viable since ticket service uses mongodb
      // which may not always be true across different services
      // .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId is required.')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // find the ticket that user is trying to order
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // make sure ticket is available;
    if (await ticket.isReserved()) {
      throw new BadRequestError("Ticket is already reserved.");
    }

    // create expiration for new order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // create the order and write to db
    const order = Order.make({
      // validated by requireAuth already
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    // publish event

    return res.status(201).json(order);
  });

export { router as newOrderRouter };