import Queue from 'bull';
import { REDIS_HOST } from '../config';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: REDIS_HOST,
  }
});

expirationQueue.process(async (job) => {
  console.log('TODO: publish an expiration:complete event with orderId', job.data.orderId);
});


export { expirationQueue };