import { BaseError, refinePaginators } from '../../commons';
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

    const event = await eventModel.create({
      ...params,
      creatorName: user.username,
    });
    return event;
  },

  /**
   *
   * Get all events
   *
   */

  async getEvents(params: { skip?: string; limit?: string }) {
    const { skip, limit } = params;

    const paginators = refinePaginators({
      skip: <string>skip,
      limit: <string>limit,
    });

    const totalNumOfEvents = await eventModel.count();
    const events = await eventModel.find({}, {}, { ...paginators });

    return { events, totalNumOfEvents };
  },

  /**
   *
   * Get all events by a user
   *
   */

  async getEventsByUser(params: {
    username: string;
    skip?: string;
    limit?: string;
  }) {
    const { username, skip, limit } = params;
    const user = await userModel.findOne({ username });

    if (!user) {
      throw new BaseError({
        status: 403,
        message: 'Could not find a user with the given username',
      });
    }

    const paginators = refinePaginators({
      skip: <string>skip,
      limit: <string>limit,
    });

    const totalNumOfEvents = await eventModel.count();
    const totalNumOfEventsByUser = await eventModel.count({ orgId: user._id });

    const events = await eventModel.find(
      { orgId: user._id },
      {},
      { ...paginators }
    );
    return { events, totalNumOfEventsByUser, totalNumOfEvents };
  },

  /**
   *
   * Get an event (by events title) by a user
   *
   */

  async getEvent(params: { username: string; eventName: string }) {
    const { username, eventName } = params;

    const user = await userModel.findOne({ username });
    if (!user) {
      throw new BaseError({
        status: 400,
        message: 'Could not find a user with the given username',
      });
    }

    const event = await eventModel.findOne({
      name: eventName,
      creatorName: username,
    });

    if (!event) {
      throw new BaseError({
        status: 404,
        message:
          'Could not find an event with the given eventName and username',
      });
    }

    return { event };
  },
};
