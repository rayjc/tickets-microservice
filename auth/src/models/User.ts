import mongoose from 'mongoose';
import { PasswordManager } from '../helpers/PasswordManager';

// interface describing the properties
// required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface describing the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  make(attrs: UserAttrs): UserDoc;
}

// An interface describing the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  // add additional properties here
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
}, {
  // filter out and format return object
  // violating MVC slightly; should perhaps be in view...
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
    },
    versionKey: false,
  }
});

// Intercept password write
// Note: binding this to function
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await PasswordManager.hash(this.get('password'));
    this.set('password', hashed);
  }

  done();
});

// static makeUser method abstract User away for type checking
// use User.make() instead of new User()
userSchema.statics.make = (attrs: UserAttrs) => {
  return new User(attrs);
};


const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };