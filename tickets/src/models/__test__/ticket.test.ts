import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // create a new ticket
  const ticket = Ticket.make({
    title: 'concert',
    price: 1,
    userId: 'some-id'
  });

  // save ticket to db
  await ticket.save();

  // fetch two instances from the same ticket
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // attempt to make two different updates to the same ticket
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 100 });
  // write two updates for the same version0 ticket
  await firstInstance!.save();
  await expect(secondInstance!.save()).rejects.toThrow();
});

it('increments the version on multiple writes', async () => {
  const ticket = Ticket.make({
    title: 'concert',
    price: 20,
    userId: 'some-id'
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});