import { ActivityLog } from "../models";
import { IOrganization, IUser } from "../types";

interface LogParams {
  org: IOrganization;
  user: IUser;
  action: string;
  resource?: string;
  meta?: Record<string, unknown>;
}

const logActivity = async ({
  org,
  user,
  action,
  resource,
  meta,
}: LogParams): Promise<void> => {
  try {
    await ActivityLog.create({
      organization: org._id,
      user: user._id,
      userName: user.name,
      action,
      resource,
      meta,
    });
  } catch (err) {
    console.error("Activity log error:", err);
  }
};

export default logActivity;
