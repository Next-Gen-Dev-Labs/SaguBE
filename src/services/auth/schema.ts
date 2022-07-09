import { z, string } from 'zod';
import {
  parseWalletAddress,
  parseUsername,
  parseUrl,
  parseFacebook,
  parseTwitter,
  parseInstagram,
  parseLinkedin,
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
        'username is not properly formatted. username cannot start with a number, contain special characters and/or spaces.',
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

  images: z
    .object({
      banner: string({
        required_error:
          'No value received for images.banner, images.banner is required.',
      }).refine((val: string) => parseUrl(val), {
        message: 'The url for images.banner is not properly formatted!',
      }),

      profile: string({
        required_error:
          'No value received for images.profile, images.profile is required.',
      }).refine((val: string) => parseUrl(val), {
        message: 'The url for images.profile is not properly formatted!',
      }),
    })
    .required(),
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

export const socialsSchema = z.object({
  facebook: string({
    required_error: 'No value received for facebook, facebook is required.',
  })
    .refine((val: string) => parseUrl(val), {
      message: 'The url for facebook is not properly formatted.',
    })
    .refine((val: string) => parseFacebook(val), {
      message: 'invalid url for facebook, please input a proper facebook url.',
    }),

  twitter: string({
    required_error: 'No value received for twitter, twitter is required.',
  })
    .refine((val: string) => parseUrl(val), {
      message: 'The url for twitter is not properly formatted.',
    })
    .refine((val: string) => parseTwitter(val), {
      message: 'invalid url for twitter, please input a proper twitter url.',
    }),

  instagram: string()
    .refine((val: string) => parseUrl(val), {
      message: 'The url for instagram is not properly formatted.',
    })
    .refine((val: string) => parseInstagram(val), {
      message:
        'invalid url for instagram, please input a proper instagram url.',
    })
    .optional(),

  linkedin: string()
    .refine((val: string) => parseUrl(val), {
      message: 'The url for linkedin is not properly formatted.',
    })
    .refine((val: string) => parseLinkedin(val), {
      message: 'invalid url for linkedin, please input a proper linkedin url.',
    })
    .optional(),

  organization: string({
    required_error:
      'No value received for organization, organization is required.',
  }).nonempty({
    message: 'organization is empty! organization cannot be empty.',
  }),
});
