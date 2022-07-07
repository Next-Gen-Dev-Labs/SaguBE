import { bufferToHex } from 'ethereumjs-util';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import { userModel, IUser } from '../../models';
import { BaseError, signToken } from '../../commons';
import { hash } from 'bcryptjs';
import { META_SIGN_MESSAGE, NONCE_FACTOR, SALT } from '../../config';
import { HydratedDocument } from 'mongoose';

export const Signup = {
  async genric(params: { data: IUser }) {
    const { data } = params;

    const existingUser = {
      walletAddress: await userModel.findOne({
        walletAddress: data['walletAddress'],
      }),

      email: await userModel.findOne({ email: data['email'] }),
    };

    if (existingUser['walletAddress']) {
      throw new BaseError({
        status: 403,
        message: 'Forbidden! A user with this walletAddress already exists!',
      });
    }

    if (existingUser['email']) {
      throw new BaseError({
        status: 403,
        message: 'Forbidden! A user with this email already exists!',
      });
    }

    data['password'] = data['password']
      ? await hash(data['password'], SALT)
      : undefined;

    await userModel.create({
      ...data,
      nonce: Math.floor(Math.random() * NONCE_FACTOR),
    });

    const user = await userModel
      .findOne({ walletAddress: data['walletAddress'] })
      .select('-nonce -password');
    return { user };
  },

  async handshake(params: { walletAddress: string }) {
    const { walletAddress } = params;

    const user = await userModel.findOne({ walletAddress });

    if (user) {
      throw new BaseError({
        status: 403,
        message: 'Forbidden! A user with this walletAddress already exists!',
      });
    }

    return 'Proceed to sign up.';
  },

  async oauth2() {},
};

export const Signin = {
  async oauth2() {},

  web3: {
    async handshake(params: { walletAddress: string }) {
      const { walletAddress } = params;
      const user = await userModel.findOne({ walletAddress });

      if (!user) {
        throw new BaseError({
          status: 403,
          message: 'No user found for the provided walletAddress!',
        });
      }

      return { signMessage: META_SIGN_MESSAGE + user.nonce };
    },

    async authenticate(params: { walletAddress: string; signature: string }) {
      const { walletAddress, signature } = params;
      const user = await userModel
        .findOne({ walletAddress })
        .select('-password')
        .lean();

      if (!user) {
        throw new BaseError({
          status: 403,
          message: 'No user found for the provided walletAddress!',
        });
      }

      const msg = META_SIGN_MESSAGE + user.nonce;
      const data = bufferToHex(Buffer.from(msg, 'utf8'));

      const address = recoverPersonalSignature({ data, signature });

      if (address.toLowerCase() !== walletAddress.toLowerCase()) {
        throw new BaseError({
          status: 401,
          message: 'Signature verification failed!',
          name: 'AuthError',
        });
      }

      await userModel.updateOne(
        { walletAddress },
        { nonce: Math.floor(Math.random() * NONCE_FACTOR) }
      );

      const accessToken = await signToken({ id: String(user._id) });
      return { accessToken, user: { ...user, nonce: undefined } };
    },
  },
};

export const miscellanous = {
  async setPassword(params: { email: string; password: string }) {
    const { email, password } = params;
    const user = await userModel.findOne({ email });

    if (!user) {
      throw new BaseError({
        status: 400,
        message: 'The email provided did not match any user in the database!',
      });
    }

    if (user.password) {
      throw new BaseError({
        status: 403,
        message: 'Password already set!',
      });
    }

    const hashed = await hash(password, SALT);
    user.password = hashed;
    await user.save();

    return `User with email: ${email} has set their password.`;
  },
};
