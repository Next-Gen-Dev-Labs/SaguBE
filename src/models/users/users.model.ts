import { Schema, Model, model } from 'mongoose';

/**
 *
 * users interfaces and types
 *
 */

export interface IUser {
  orgName: string;
  username: string;
  email: string;
  walletAddress: string;
  bio?: string;
  nonce?: number;
}

type UserModel = Model<IUser, {}, {}>;

/**
 *
 * Users Model with pre hook and instance methods
 *
 */

const userSchema = new Schema<IUser, UserModel>(
  {
    orgName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    walletAddress: { type: String, required: true },
    bio: { type: String, required: false },
    nonce: { type: Number, required: false },
  },
  { timestamps: true }
);

export const userModel = model<IUser, UserModel>('User', userSchema);
