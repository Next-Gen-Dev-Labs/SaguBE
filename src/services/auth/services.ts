import { bufferToHex } from 'ethereumjs-util';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import { userModel, IUser } from '../../models';
import { BaseError, signToken } from '../../commons';
import { META_SIGN_MESSAGE, NONCE_FACTOR } from '../../config';

export const Signup = {
  async genric(params: { data: IUser }) {
    const { data } = params;

    const existingUser = {
      email: await userModel.findOne({ email: data['email'] }),
      username: await userModel.findOne({ username: data['username'] }),
      walletAddress: await userModel.findOne({
        walletAddress: data['walletAddress'],
      }),
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

    if (existingUser['username']) {
      throw new BaseError({
        status: 403,
        message: 'Forbidden! A user with this username already exists!',
      });
    }

    await userModel.create({
      ...data,
      nonce: Math.floor(Math.random() * NONCE_FACTOR),
    });

    const user = await userModel
      .findOne({ walletAddress: data['walletAddress'] })
      .select('-nonce');
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
      const user = await userModel.findOne({ walletAddress }).lean();

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
