import mongoose from 'mongoose';

import { app } from './app';
import { MONGODB_URI, NATS_CLIENT_ID, NATS_CLUSTER_ID, NATS_URL } from './config';
import { OrderCreatedListener } from './events/listeners/OrderCreatedListener';
import { natsWrapper } from './NatsWrapper';

const init = async () => {
  console.log("Starting server...");
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

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();

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