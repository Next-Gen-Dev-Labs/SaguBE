import { Schema, Model, model, Types } from 'mongoose';

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
  images: {
    banner: string;
    profile: string;
  };
}

export interface ISocial {
  facebook: string;
  twitter: string;
  instagram?: string;
  linkedIn?: string;
  discord?: string;
  organization: Types.ObjectId;
}

type UserModel = Model<IUser, {}, {}>;
type SocialModel = Model<ISocial, {}, {}>;

/**
 *
 * Users Model
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
    images: {
      banner: { type: String, required: true },
      profile: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const userModel = model<IUser, UserModel>('User', userSchema);

/**
 *
 * Socials Model
 *
 */

const socialSchema = new Schema<ISocial, SocialModel>(
  {
    facebook: { type: String, required: true },
    twitter: { type: String, required: true },
    instagram: { type: String, required: false },
    linkedIn: { type: String, required: false },
    discord: { type: String, required: false },
    organization: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const socialModel = model<ISocial, SocialModel>('Social', socialSchema);
