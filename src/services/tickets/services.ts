import {
  userModel,
  ticketsModel,
  ITickets,
  TicketType,
  IMintedTickets,
  mintedModel,
} from '../../models';
import { BaseError, postData } from '../../commons';
import { PINATA_BASE_URL, pinata_jwt } from '../../config';
import { Types } from 'mongoose';

export default {
  /**
   *
   * create ticket recordservice
   *
   */

  async createTicketRecord(params: ITickets) {
    const { creatorId, type, price, name } = params;

    const user = await userModel.findById(creatorId).lean();

    if (!user) {
      throw new BaseError({
        status: 403,
        message: 'Invalid user Id',
      });
    }

    if (price && type === TicketType.free) {
      throw new BaseError({
        status: 400,
        message: 'Cannot set a price for a ticket whose type is set to free!',
      });
    }

    if (!price && type === TicketType.paid) {
      throw new BaseError({
        status: 400,
        message: 'price cannot be null for a ticket whose type is set to paid!',
      });
    }

    const duplicate = await ticketsModel.findOne({ creatorId, name }).lean();

    if (duplicate) {
      throw new BaseError({
        status: 400,
        message: 'Ticket with this creatorId and name already exists!',
      });
    }

    const ticket = await ticketsModel.create(params);
    const data = JSON.stringify({
      pinataOptions: {
        cidVersion: 1,
      },

      pinataMetadata: {
        name: 'NFTs',
        keyvalues: {
          creator: user.username,
          creatorOrg: user.orgName,
          nftName: params.name,
        },
      },

      pinataContent: {
        ...params,
        creatorId: undefined,
      },
    });

    const pinataStuff = await postData({
      url: `${PINATA_BASE_URL}/pinning/pinJSONToIPFS`,
      headers: { Authorization: `Bearer ${pinata_jwt}` },
      data,
    });

    return { ticket, pinataStuff };
  },

  /**
   *
   * Create a record for minted tickets
   *
   */

  async storeMintedData(params: IMintedTickets) {
    const { creatorId, ticketId, transactionHash } = params;

    const user = await userModel.findById(creatorId).lean();
    if (!user) {
      throw new BaseError({
        status: 403,
        message: 'No user matches this creatorId',
        extraDetails: { errorField: 'creatorId' },
      });
    }

    const ticket = await ticketsModel.findById(ticketId).lean();
    if (!ticket) {
      throw new BaseError({
        status: 403,
        message: 'No ticket matches this ticketId',
        extraDetails: { errorField: 'ticketId' },
      });
    }

    const duplicate = await mintedModel.findOne({ transactionHash }).lean();
    if (duplicate) {
      throw new BaseError({
        status: 403,
        message:
          'Duplicate entry spotted, a record already exists for this transactionHash',
        extraDetails: { errorField: 'transactionHash' },
      });
    }

    if (ticket.creatorId.toString() !== creatorId.toString()) {
      throw new BaseError({
        status: 403,
        message: "Mismatched creatorId in ticket's record",
        extraDetails: { errorField: 'creatorId' },
      });
    }

    const minted = await mintedModel.create(params);
    return minted;
  },
};
