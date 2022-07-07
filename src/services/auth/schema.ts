import { z, string } from 'zod';
import {
  parseWalletAddress,
  parsePassword,
  parseUsername,
} from '../../commons';

export const signupSchema = z.object({
  orgName: string({
    required_error: 'No value received for orgName, orgName is required.',
  })
    .min(3, { message: 'orgName cannot be less than 3 characters' })
    .max(30, { message: 'orgName cannot be longer than 30 characters.' }),

  email: string({
    required_error: 'No value received for email, email is required.',
  }).email({ message: 'email is not properly formatted.' }),

  username: string({
    required_error: 'No value received for username, username is required.',
  })
    .min(3, { message: 'username cannot be less than 3 characters' })
    .max(30, { message: 'username cannot be longer than 30 characters.' })
    .refine((val: string) => parseUsername(val), {
      message:
        'username is not properly formatted. no spaces allowed in username.',
    }),

  walletAddress: string({
    required_error:
      'No value for walletAddress received, walletAddress is requireds',
  }).refine((val: string) => parseWalletAddress(val), {
    message: 'The walletAddress is not a valid ethereum wallet address',
  }),

  bio: string({})
    .max(100, {
      message: 'bio cannot be longer than 100 characters.',
    })
    .optional(),

  password: string({})
    .refine((val: string) => parsePassword(val), {
      message:
        'Password format is incorrect! Password must be minimum of 8 characters, contain at least one uppercase, lowercase and special character.',
    })
    .optional(),
});

export const handshakeSchema = z.object({
  walletAddress: string({
    required_error:
      'No value for walletAddress received, walletAddress is required.',
  }).refine((val: string) => parseWalletAddress(val), {
    message: 'The walletAddress is not a valid ethereum wallet address',
  }),
});

export const web3SigninSchema = z.object({
  walletAddress: string({
    required_error:
      'No value for walletAddress received, walletAddress is required.',
  }).refine((val: string) => parseWalletAddress(val), {
    message: 'The walletAddress is not a valid ethereum wallet address',
  }),

  signature: string({
    required_error: 'No value received for signature, signature is required.',
  }),
});

export const miscellanous = {
  setPasswordSchema: z.object({
    email: string({
      required_error: 'No value received for email, email is required.',
    }).email({ message: 'email is not properly formatted.' }),

    password: string({
      required_error: 'No value received for password, password is required.',
    }).refine((val: string) => parsePassword(val), {
      message:
        'Password format is incorrect! Password must be minimum of 8 characters, contain at least one uppercase, lowercase and special character.',
    }),
  }),
};
