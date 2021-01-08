import Stripe from 'stripe';
import { STRIPE_KEY } from './config';

export const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2020-08-27'
});