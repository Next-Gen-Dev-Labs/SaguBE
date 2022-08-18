import { userModel, ticketsModel, ITickets, TicketType } from '../../models';
import { BaseError } from '../../commons';

export default {
  /**
   *
   * create ticket recordservice
   *
   */

  async createTicketRecord(params: ITickets) {
    const { creatorId, type, fee } = params;

    const user = await userModel.findById(creatorId);

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

    return ticket;
  },
};
