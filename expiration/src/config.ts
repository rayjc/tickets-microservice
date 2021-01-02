export const NATS_CLUSTER_ID = process.env.NATS_CLUSTER_ID || "expiration";
export const NATS_CLIENT_ID = process.env.NATS_CLIENT_ID || "some-client-id";
export const NATS_URL = process.env.NATS_URL || "http://nats-srv:4222";

export const QUEUE_GROUP_NAME = process.env.QUEUE_GROUP_NAME || 'expiration-service';
