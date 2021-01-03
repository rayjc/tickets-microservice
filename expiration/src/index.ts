import { NATS_CLIENT_ID, NATS_CLUSTER_ID, NATS_URL } from './config';
import { natsWrapper } from './NatsWrapper';
import { OrderCreatedListener } from './events/listeners/OrderCreatedListener';

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

    new OrderCreatedListener(natsWrapper.client).listen();

  } catch (error) {
    console.error(error);
  }
};



init();