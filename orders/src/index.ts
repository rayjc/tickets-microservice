import mongoose from 'mongoose';

import { app } from './app';
import { MONGODB_URI, NATS_CLIENT_ID, NATS_CLUSTER_ID, NATS_URL } from './config';
import { natsWrapper } from './NatsWrapper';
import { TicketCreatedListener } from './events/listeners/TicketCreatedListener';
import { TicketUpdatedListener } from './events/listeners/TicketUpdatedListener';
import { ExpirationCompleteListener } from './events/listeners/ExpirationCompleteListener';

const init = async () => {
  try {
    await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);
    // could consider moving clean up to a natsWrapper method
    // though prefer to exit process at top level
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    // instantiate event listeners
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();

    // connect db
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  } catch (error) {
    console.error(error);
  }


  app.listen(3000, () => {
    console.log('Listening on 3000...');
  });
};



init();