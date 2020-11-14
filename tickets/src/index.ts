import mongoose from 'mongoose';

import { app } from './app';
import { MONGODB_URI } from './config';
import { natsWrapper } from './NatsWrapper';

const init = async () => {
  try {
    await natsWrapper.connect('ticketing', 'some_id', 'http://nats-srv:4222');
    // could consider moving clean up to a natsWrapper method
    // though prefer to exit process at top level
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

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