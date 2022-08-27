import {
  userModel,
  ticketsModel,
  ITickets,
  TicketType,
  IMintedTickets,
  mintedModel,
} from '../../models';
import { BaseError, postData, refinePaginators } from '../../commons';
import { PINATA_BASE_URL, pinata_jwt } from '../../config';
import { Types } from 'mongoose';

export default {
  /**
   *
   * create ticket recordservice
   *
   */

  async createTicketRecord(params: ITickets) {
    const { creatorId, type, fee } = params;

    const user = await userModel.findById(creatorId).lean();

    if (!user) {
      throw new BaseError({
        status: 403,
        message: 'Invalid user Id',
      });
    }

    if (fee && type === TicketType.free) {
      throw new BaseError({
        status: 400,
        message: 'Cannot set a fee for a ticket whose type is set to free!',
      });
    }

    if (!fee && type === TicketType.paid) {
      throw new BaseError({
        status: 400,
        message: 'Fee cannot be null for a ticket whose type is set to paid!',
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
    const { creatorId, ticketId } = params;

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

    const duplicate = await mintedModel.findOne({ ticketId }).lean();
    if (duplicate) {
      throw new BaseError({
        status: 403,
        message:
          'Duplicate entry spotted, a record already exists for this ticketId',
        extraDetails: { errorField: 'ticketId' },
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

  /**
   *
   * Get minted ticket by user
   *
   */

  async getMintedTicket(params: { username: string }) {
    const { username } = params;

    const user = await userModel.findOne({ username });

    if (!user) {
      throw new BaseError({
        status: 403,
        message: 'Operation forbidden',
      });
    }

    const tickets = await mintedModel
      .find({
        creatorId: user.id,
      })
      .lean();

    return { tickets };
  },

  /**
   *
   * list all minted tickets
   *
   */

  async listMintedTickets(params: { skip?: string; limit?: string }) {
    const { skip, limit } = params;
    const paginators = refinePaginators({
      skip: <string>skip,
      limit: <string>limit,
    });

    const totalNumOfTickets = await mintedModel.count();
    const tickets = await mintedModel.find({}, {}, { ...paginators });

    return { tickets, totalNumOfTickets };
  },
};
