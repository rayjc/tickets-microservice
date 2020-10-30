import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { NotFoundError } from '@rayjc-dev/common';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  // extract ticket
  const ticket = await Ticket.findById(req.params.id);
  // check if ticket exists
  if (!ticket) {
    throw new NotFoundError();
  }

  res.json(ticket);
});

export { router as showTicketRouter };