import { bufferToHex } from 'ethereumjs-util';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import { userModel, IUser, ISocial, socialModel } from '../../models';
import { BaseError, signToken } from '../../commons';
import { META_SIGN_MESSAGE, NONCE_FACTOR } from '../../config';

export const Signup = {
  async genric(params: { data: IUser }) {
    const { data } = params;
    data['username'] = data['username'].toLowerCase();

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

  async addSocials(params: ISocial) {
    const { organization } = params;

    const org = await userModel.findById(organization);
    if (!org) {
      throw new BaseError({
        status: 403,
        message: 'No organazation found using the provided org id.',
      });
    }

    const existingSocials = await socialModel.findOne({ organization });
    if (existingSocials) {
      throw new BaseError({
        status: 403,
        message: 'Forbidden! This user has already set their social links.',
      });
    }

    const duplicate = {
      fb: await socialModel.findOne({ facebook: params['facebook'] }),
      tw: await socialModel.findOne({ twitter: params['twitter'] }),
    };

    if (duplicate.fb) {
      throw new BaseError({
        status: 400,
        message: 'This facebook social link is already in use by another user!',
      });
    }

    if (duplicate.tw) {
      throw new BaseError({
        status: 400,
        message: 'This twitter social link is already in use by another user!',
      });
    }

    if (params.linkedIn) {
      const duplicate = await socialModel.findOne({
        linkedIn: params['linkedIn'],
      });

      if (duplicate) {
        throw new BaseError({
          status: 400,
          message:
            'This linkedin social link is already in use by another user!',
        });
      }
    }

    if (params.instagram) {
      const duplicate = await socialModel.findOne({
        instagram: params['instagram'],
      });

      if (duplicate) {
        throw new BaseError({
          status: 400,
          message:
            'This instagram social link is already in use by another user!',
        });
      }
    }

    const socials = await socialModel.create(params);
    return { socials };
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
