export const JWT_KEY = process.env.JWT_KEY || "test";
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/payments";

export const NATS_CLUSTER_ID = process.env.NATS_CLUSTER_ID || "ticketing";
export const NATS_CLIENT_ID = process.env.NATS_CLIENT_ID || "payments-client-id";
export const NATS_URL = process.env.NATS_URL || "http://nats-srv:4222";

export const QUEUE_GROUP_NAME = process.env.QUEUE_GROUP_NAME || 'payments-service';

export const STRIPE_KEY = process.env.STRIPE_KEY ||
  "sk_test_51I6X0uAm9e0Oggg7xCQNZpiemxNyn1jwJcBm8TEds0IuccpHElEI6RKHiPkequhI5REois0FhXo7yG3QBWbiIr9E00pAEYiJgn";