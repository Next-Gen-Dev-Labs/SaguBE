import { BaseError } from '../../commons';
import { eventModel, userModel, IEvents, Events_Type } from '../../models';

export default {
  /**
   *
   * Create
   *
   */

  async create(params: IEvents) {
    const { orgId, name, type, price } = params;

    const user = await userModel.findById(orgId);
    if (!user) {
      throw new BaseError({
        status: 403,
        message: 'Invalid user id!',
      });
    }

    if (price) {
      if (type === Events_Type['free']) {
        throw new BaseError({
          status: 400,
          message:
            'Cannot create event because price is set. free type events cannot have a set price',
        });
      }
    }

    if (type === Events_Type['paid']) {
      if (!price) {
        throw new BaseError({
          status: 400,
          message:
            'Cannot create event because price is not set. paid type events must have a set price.',
        });
      }
    }

    const duplicateEvents = await eventModel.findOne({ orgId, name });
    if (duplicateEvents) {
      throw new BaseError({
        status: 400,
        message:
          'Cannot create event because user already has an event with this name.',
      });
    }

    const event = await eventModel.create(params);
    return event;
  },
};
