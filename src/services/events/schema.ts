import { number, object, string } from 'zod';
import {
  parseDate,
  parseEventCategory,
  parseEventType,
  parseUrl,
  parseUsername,
} from '../../commons';
export default {
  /**
   *
   * Create
   *
   */

  create: object({
    name: string({
      required_error: 'No value received for name, name is required.',
    }).nonempty({ message: 'empty string received! name cannot be empty.' }),

    desc: string({
      required_error: 'No value received for desc, desc is required.',
    }).nonempty({ message: 'empty string received! desc cannot be empty.' }),

    category: string({
      required_error: 'No value received for category, category is required.',
    }).refine((val: string) => parseEventCategory(val), {
      message:
        "Invalid value for category! only 'tech' or 'finance' is allowed.",
    }),

    type: string({
      required_error: 'No value received for type, type is required.',
    }).refine((val: string) => parseEventType(val), {
      message: "Invalid value for type! only 'free' or 'paid' is allowed.",
    }),

    price: number()
      .nonnegative({
        message: 'negative value received! price cannot be a negative value',
      })
      .optional(),

    venue: string({
      required_error: 'No value received for venue, venue is required.',
    }).nonempty({ message: 'empty string received!, venue cannot be empty.' }),

    image: string({
      required_error: 'No value received for image, image is required.',
    }).refine((val: string) => parseUrl(val), {
      message: 'Invalid url for image!',
    }),

    datetime: string({
      required_error: 'No value received for datetime, datetime is required.',
    }).refine((val: string) => parseDate(val), {
      message: 'Invalid date value received for datetime!',
    }),
  }).strict(),

  /**
   *
   * getEvent
   *
   */

  getEvent: object({
    username: string({
      required_error: 'No value received for username, username is required.',
    })
      .min(3, { message: 'username cannot be less than 3 characters' })
      .max(30, { message: 'username cannot be longer than 30 characters.' })
      .refine((val: string) => parseUsername(val), {
        message:
          'username is not properly formatted. username cannot start with a number, contain special characters and/or spaces.',
      }),

    eventName: string({
      required_error: 'No value received for eventName, eventName is required.',
    }).nonempty({ message: 'empty string received! name cannot be empty.' }),
  }),
};
