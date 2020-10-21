import express from 'express';
import { json } from 'body-parser';
import morgan from 'morgan';

const app = express();
app.use(json());
app.use(morgan("dev"))


app.get('/api/users/currentuser', (req, res) => {
  res.send('Hi!');
});


app.listen(3000, () => {
  console.log('Listening on 3000...');
});