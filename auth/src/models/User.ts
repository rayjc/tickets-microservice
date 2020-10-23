import mongoose from 'mongoose';

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
});

// static makeUser method abstract User away for type checking
// use User.make() instead of new User()
userSchema.statics.make = (attrs: UserAttrs) => {
  return new User(attrs);
};


const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };