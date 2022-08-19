import { model, Schema, Types } from 'mongoose';

/**
 *
 * Tickets Interfaces and Enums
 *
 */

export interface ITickets {
  name: string;
  desc: string;
  fee?: number;
  price?: number | null;
  coverImage: string;
  type: TicketType;
  category: TicketCategory;
  creatorId: Types.ObjectId;
}

export enum TicketType {
  free = 'free',
  paid = 'paid',
}

export enum TicketCategory {
  single = 'single',
  membership = 'membership',
  donation = 'donation',
  fundraiser = 'fundraiser',
}

/**
 *
 * Tickets Schema
 *
 */

const schema = new Schema<ITickets>(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    fee: { type: Number, required: false, default: 100 },
    price: { type: Number, required: false, default: null },
    coverImage: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: Object.values(TicketType),
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(TicketCategory),
    },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

/**
 *
 * Tickets Model
 *
 */

export const ticketsModel = model('Ticket', schema);
