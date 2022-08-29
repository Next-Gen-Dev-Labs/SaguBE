import { string, number, object, nativeEnum } from 'zod';
import { parseUrl } from '../../commons';
import { TicketCategory, TicketType } from '../../models';

export default {
  /**
   *
   * create ticket schema
   *
   */

  createTicket: object({
    name: string({
      required_error: 'You did not provide a value for name, name is required.',
    }).nonempty({ message: 'name cannot be empty.' }),

    desc: string({
      required_error: 'You did not provide a value for desc, desc is required.',
    }).nonempty({ message: 'desc cannot be empty.' }),

    coverImage: string({
      required_error:
        'You did not provide a value for coverImage, coverImage is required.',
    }).refine((val: string) => parseUrl(val), {
      message: 'Invalid url received for coverImage',
    }),

    fee: number().nonnegative({ message: 'fee cannot be negative' }).optional(),

    price: number()
      .nonnegative({ message: 'price cannot be negative' })
      .optional(),

    type: nativeEnum(TicketType),

    category: nativeEnum(TicketCategory),
  }).strict(),

  /**
   *
   * minted tickets schema
   *
   */

  mintedTicket: object({
    tokenId: string({
      required_error:
        'You did not provide a value for tokenId, tokenId is required.',
    }).array(),

    ticketId: string({
      required_error:
        'You did not provide a value for ticketId, ticketId is required.',
    }),

    creatorWallet: string({
      required_error:
        'You did not provide a value for creatorWallet, creatorWallet is required.',
    }),

    transactionHash: string({
      required_error:
        'You did not provide a value for transactionHash, transactionHash is  required.',
    }),
  }).strict(),

  /**
   *
   * buy minted tickets schema
   *
   */

  buyMintedTicket: object({
    price: number({
      required_error:
        'You did not provide a value for price, price is required',
    }).nonnegative({ message: 'price cannot be negative' }),

    ticket: string({
      required_error:
        'You did not provide a value for ticket, ticket is required',
    }),
  }),
};
