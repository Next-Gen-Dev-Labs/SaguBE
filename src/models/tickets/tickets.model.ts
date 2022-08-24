import { model, Schema, Types } from 'mongoose';

/**
 *
 * Tickets Interfaces and Enums
 *
 */

export interface ITickets {
  name: string;
  desc: string;
  fee: number | null;
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

export interface IMintedTickets {
  tokenId: string;
  creatorId: Types.ObjectId;
  ticketId: Types.ObjectId;
  creatorWallet: string;
  transactionHash: string;
}

/**
 *
 * Tickets Schema
 *
 */

const schema = {
  unminted: new Schema<ITickets>(
    {
      name: { type: String, required: true },
      desc: { type: String, required: true },
      fee: { type: Number, required: true, default: null },
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
  ),

  minted: new Schema<IMintedTickets>({
    tokenId: { type: String, required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
    creatorWallet: { type: String, required: true },
    transactionHash: { type: String, required: true },
  }),
};

/**
 *
 * Tickets Model
 *
 */

export const ticketsModel = model('Ticket', schema.unminted);
export const mintedModel = model('MintedTicket', schema.minted);
