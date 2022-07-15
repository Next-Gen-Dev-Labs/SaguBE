import { socialModel, userModel } from '../../models';
import { BaseError } from '../../commons';

export default {
  async getSocialLinks(params: { orgId: string }) {
    const { orgId } = params;

    const organization = await userModel.findById(orgId);
    if (!organization) {
      throw new BaseError({
        status: 403,
        message: 'Could not find an organization with the id received.',
      });
    }

    const record = await socialModel.findOne({ organization: orgId });
    if (!record) {
      throw new BaseError({
        status: 400,
        message: 'No social links record created for this user.',
      });
    }

    return record;
  },
};
