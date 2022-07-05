import { Schema, Model, model } from 'mongoose';
import { SALT } from '../../config';
import bcrypt from 'bcryptjs';

/**
 *
 * users interfaces and types
 *
 */

export interface IUser {
  orgName: string;
  bio?: string;
  username: string;
  email: string;
  walletAddress: string;
  password?: string;
  nonce?: number;
}

interface IUserMethods {
  comparePassword(params: { password: string }): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

/**
 *
 * Users Model with pre hook and instance methods
 *
 */

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    orgName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    walletAddress: { type: String, required: true },
    bio: { type: String, required: false },
    password: { type: String, required: false },
    nonce: { type: Number, required: false },
  },
  { timestamps: true }
);

userSchema.method(
  'comparePassword',
  async function comparePassword(params: { password: string }) {
    return await bcrypt.compare(params.password, this.password);
  }
);

export const userModel = model<IUser, UserModel>('User', userSchema);
