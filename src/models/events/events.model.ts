import { Schema, model } from 'mongoose';

/**
 *
 * Events interfaces and enums
 *
 */

export interface IEvents {
  name: string;
  desc: string;
  category: Events_Category;
  type: Events_Type;
  price: number | null;
  image: string;
  datetime: string;
}

export enum Events_Category {
  tech = 'tech',
  finance = 'finance',
}

export enum Events_Type {
  paid = 'paid',
  free = 'free',
}

/**
 *
 * Events Schema
 *
 */

const schema = new Schema<IEvents>(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: Object.values(Events_Category),
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(Events_Type),
    },
    price: { type: Number, required: false },
    image: { type: String, required: true },
    datetime: { type: String, required: true },
  },
  { timestamps: true }
);

/**
 *
 * Events model
 *
 */

export const eventModel = model('Event', schema);
