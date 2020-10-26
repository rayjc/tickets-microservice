import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import morgan from 'morgan';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/NotFoundError';

const app = express();
app.set('trust proxy', true);   // behind ingress-nginx
app.use(json());
app.use(
  cookieSession({
    // note: js access is disabled on default
    // unencrypted in case other services are in different lanuage
    signed: false,
    // enable TCP
    secure: true,
  })
);
app.use(morgan("dev"));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// 404 error
app.all('*', async () => {
  throw new NotFoundError();
});
// error handler
app.use(errorHandler);

export { app };