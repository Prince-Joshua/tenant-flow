import "server-only";
import type { QueryFilter } from "mongoose";
import connectDB from "@/server/db";
import { TFDocument } from "@/server/models";
import type { IDocument, IOrganization } from "@/server/types";

const SORTS: Record<string, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  title_asc: { title: 1 },
  title_desc: { title: -1 },
};

export async function getDocuments(
  org: IOrganization,
  {
    page = 1,
    limit = 10,
    search = "",
    status = "",
    sort = "newest",
  }: {
    page?: number;
    limit?: number;
    search?: string;
    status?: "" | "draft" | "active" | "archived";
    sort?: keyof typeof SORTS;
  } = {},
) {
  await connectDB();
  const query: QueryFilter<IDocument> = {
    organization: org._id,
    isTemplate: false,
  };
  query.status = status ? status : { $ne: "archived" };
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const [documents, total] = await Promise.all([
    TFDocument.find(query)
      .sort(SORTS[sort] || SORTS.newest)
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

export async function getTemplates(org: IOrganization) {
  await connectDB();
  return TFDocument.find({ organization: org._id, isTemplate: true })
    .sort({ title: 1 })
    .populate("createdBy", "name email");
}
