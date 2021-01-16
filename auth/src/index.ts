import mongoose from 'mongoose';

import { app } from './app';
import { MONGODB_URI } from './config';

const init = async () => {
  console.log("Starting server.....");
  try {
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