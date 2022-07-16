import { Schema, model, Types } from 'mongoose';

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
  price?: number;
  image: string;
  datetime: string;
  orgId: Types.ObjectId;
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
    orgId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

/**
 *
 * Events model
 *
 */

export const eventModel = model('Event', schema);
