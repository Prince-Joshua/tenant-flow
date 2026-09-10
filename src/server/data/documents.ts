import "server-only";
import connectDB from "@/server/db";
import { TFDocument } from "@/server/models";
import type { IOrganization } from "@/server/types";

export async function getDocuments(
  org: IOrganization,
  {
    page = 1,
    limit = 10,
    search = "",
  }: { page?: number; limit?: number; search?: string } = {},
) {
  await connectDB();
  const query = {
    organization: org._id,
    ...(search && { title: { $regex: search, $options: "i" } }),
  };
  const [documents, total] = await Promise.all([
    TFDocument.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("createdBy", "name email"),
    TFDocument.countDocuments(query),
  ]);
  return {
    documents,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  };
}

export async function getDocument(org: IOrganization, id: string) {
  await connectDB();
  try {
    return await TFDocument.findOne({
      _id: id,
      organization: org._id,
    }).populate("createdBy", "name email");
  } catch {
   
    return null;
  }
}
