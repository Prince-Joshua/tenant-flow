"use server";

// "Load more" actions for cursor-paginated lists. Every action re-checks
// auth/tenancy server-side; the cursor only says where to resume.

import { requireTenant, requireUser } from "@/server/data/tenant";
import { getOrgActivityPage } from "@/server/data/org";
import { getPlatformActivityPage } from "@/server/data/admin";
import { getNotificationsPage } from "@/server/data/notifications";
import { getCommentsPage } from "@/server/data/comments";

export async function loadMoreOrgActivityAction(cursor: string) {
  const { org } = await requireTenant();
  return getOrgActivityPage(org, { cursor });
}

export async function loadMorePlatformActivityAction(cursor: string) {
  return getPlatformActivityPage({ cursor });
}

export async function loadMoreNotificationsAction(
  cursor: string,
  includeOrg: boolean,
) {
  if (includeOrg) {
    const { user, org } = await requireTenant();
    return getNotificationsPage({ userId: user._id, orgId: org._id, cursor });
  }
  const user = await requireUser();
  return getNotificationsPage({ userId: user._id, cursor });
}

export async function loadMoreCommentsAction(
  documentId: string,
  cursor: string,
) {
  const { org } = await requireTenant();
  const { items, nextCursor } = await getCommentsPage(org, documentId, {
    cursor,
  });
  return { items, nextCursor };
}
