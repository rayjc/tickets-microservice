import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/TicketCreatedListener';

console.clear();

const client = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

client.on('connect', () => {
  console.log('Listener connected to NATS.');

  client.on('close', () => {
    console.log('NATS connection closed.');
    process.exit();
  });

  new TicketCreatedListener(client).listen();
});

// notify NATS streaming server to close connection gracefully
process.on('SIGNINT', () => client.close());
process.on('SIGNTERM', () => client.close());
