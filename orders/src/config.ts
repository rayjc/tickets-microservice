export const JWT_KEY = process.env.JWT_KEY || "test";
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/orders";

export const NATS_CLUSTER_ID = process.env.NATS_CLUSTER_ID || "ticketing";
export const NATS_CLIENT_ID = process.env.NATS_CLIENT_ID || "orders-client-id";
export const NATS_URL = process.env.NATS_URL || "http://nats-srv:4222";

export const QUEUE_GROUP_NAME = process.env.QUEUE_GROUP_NAME || 'orders-service';

export const EXPIRATION_WINDOW_SECONDS = process.env.EXPIRATION_WINDOW_SECONDS
  ? +process.env.EXPIRATION_WINDOW_SECONDS
  : 15 * 60;