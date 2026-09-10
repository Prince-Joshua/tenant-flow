import "server-only";
import connectDB from "@/server/db";
import { Comment } from "@/server/models";
import type { IOrganization } from "@/server/types";

export async function getComments(org: IOrganization, documentId: string) {
  await connectDB();
  try {
    return await Comment.find({
      organization: org._id,
      document: documentId,
    }).sort({ createdAt: 1 });
  } catch {
    return [];
  }
}
