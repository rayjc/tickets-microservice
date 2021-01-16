import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import morgan from 'morgan';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@rayjc-dev/common';
import { JWT_KEY } from './config';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes/index';
import { cancelOrderRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);   // behind ingress-nginx
app.use(json());
app.use(
  cookieSession({
    // note: js access is disabled on default
    // unencrypted in case other services are in different lanuage
    signed: false,
    // enable TCP; remember to load frontend with https
    // secure: process.env.NODE_ENV !== "test",
    // allow http for initial deploy
    secure: false,
  })
);
app.use(morgan("dev"));

app.use(currentUser(JWT_KEY));

app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);
app.use(cancelOrderRouter);

// 404 error
app.all('*', async () => {
  throw new NotFoundError();
});
// error handler
app.use(errorHandler);

export { app };