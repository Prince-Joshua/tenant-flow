import "server-only";
import connectDB from "@/server/db";
import { Comment } from "@/server/models";
import type { IOrganization } from "@/server/types";
import { cursorFilter, cursorSort, toCursorPage } from "@/lib/cursor";

export const COMMENTS_PAGE_SIZE = 20;

/**
 * Most recent comments first (cursor-paginated). Callers that render a thread
 * should reverse `items` for chronological display.
 */
export async function getCommentsPage(
  org: IOrganization,
  documentId: string,
  { limit = COMMENTS_PAGE_SIZE, cursor }: { limit?: number; cursor?: string | null } = {},
) {
  await connectDB();
  try {
    const [rows, total] = await Promise.all([
      Comment.find({
        organization: org._id,
        document: documentId,
        ...(cursorFilter(cursor) ?? {}),
      })
        .sort(cursorSort(-1))
        .limit(limit + 1)
        .lean(),
      cursor
        ? Promise.resolve(0)
        : Comment.countDocuments({ organization: org._id, document: documentId }),
    ]);
    const { items, nextCursor } = toCursorPage(rows as any[], limit);
    return {
      items: JSON.parse(JSON.stringify(items)) as any[],
      nextCursor,
      total,
    };
  } catch {
    return { items: [] as any[], nextCursor: null, total: 0 };
  }
}
