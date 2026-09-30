import "server-only";
import connectDB from "@/server/db";
import { Membership, ActivityLog } from "@/server/models";
import type { IOrganization } from "@/server/types";
import {
  cursorFilter,
  cursorSort,
  toCursorPage,
} from "@/lib/cursor";

export async function getOrgMembers(org: IOrganization) {
  await connectDB();
  return Membership.find({ organization: org._id, status: "active" }).populate(
    "user",
    "name email",
  );
}

export async function getOrgActivity(org: IOrganization, limit = 50) {
  await connectDB();
  return ActivityLog.find({ organization: org._id })
    .sort({ createdAt: -1 })
    .limit(limit);
}

export async function getOrgActivityPage(
  org: IOrganization,
  { limit = 20, cursor }: { limit?: number; cursor?: string | null } = {},
) {
  await connectDB();
  const rows = await ActivityLog.find({
    organization: org._id,
    ...(cursorFilter(cursor) ?? {}),
  })
    .sort(cursorSort(-1))
    .limit(limit + 1)
    .lean();
  const { items, nextCursor } = toCursorPage(rows, limit);
  return { logs: JSON.parse(JSON.stringify(items)) as any[], nextCursor };
}
