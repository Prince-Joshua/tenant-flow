import { Types } from "mongoose";



export type CursorDirection = 1 | -1;

export function encodeCursor(createdAt: Date | string, id: string): string {
  const iso = new Date(createdAt).toISOString();
  return Buffer.from(JSON.stringify([iso, id])).toString("base64url");
}

export function decodeCursor(
  cursor?: string | null,
): { createdAt: Date; id: Types.ObjectId } | null {
  if (!cursor) return null;
  try {
    const [iso, id] = JSON.parse(Buffer.from(cursor, "base64url").toString());
    const createdAt = new Date(iso);
    if (Number.isNaN(createdAt.getTime()) || !Types.ObjectId.isValid(id)) {
      return null;
    }
    return { createdAt, id: new Types.ObjectId(id) };
  } catch {
    return null;
  }
}

/** Filter selecting rows strictly after the cursor in the given sort order. */
export function cursorFilter(
  cursor?: string | null,
  direction: CursorDirection = -1,
): Record<string, any> | null {
  const c = decodeCursor(cursor);
  if (!c) return null;
  const op = direction === -1 ? "$lt" : "$gt";
  return {
    $or: [
      { createdAt: { [op]: c.createdAt } },
      { createdAt: c.createdAt, _id: { [op]: c.id } },
    ],
  };
}

export function cursorSort(direction: CursorDirection = -1) {
  return { createdAt: direction, _id: direction } as const;
}

/**
 * Pass rows fetched with `limit + 1`. Trims the extra row and returns the
 * cursor for the next page (or null when there is no more data).
 */
export function toCursorPage<T extends { _id: unknown; createdAt: Date }>(
  rows: T[],
  limit: number,
): { items: T[]; nextCursor: string | null } {
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const last = items[items.length - 1];
  return {
    items,
    nextCursor:
      hasMore && last ? encodeCursor(last.createdAt, String(last._id)) : null,
  };
}
