import { userModel, ticketsModel, ITickets, TicketType } from '../../models';
import { BaseError, postData } from '../../commons';
import { PINATA_BASE_URL, pinata_jwt } from '../../config';

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
};
