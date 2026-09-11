import "server-only";
import connectDB from "@/server/db";
import { Contact } from "@/server/models";
import type { IOrganization } from "@/server/types";

export async function getOrgContacts(org: IOrganization) {
  await connectDB();
  return Contact.find({ organization: org._id }).sort({ createdAt: -1 });
}
