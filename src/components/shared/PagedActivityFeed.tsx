"use client";

import { useState, useTransition } from "react";
import { Box } from "@chakra-ui/react";
import { ActivityFeed } from "@/components/shared";
import { LoadMoreButton } from "@/components/shared/LoadMoreButton";

type Page = { logs: any[]; nextCursor: string | null };

export default function PagedActivityFeed({
  initialLogs,
  initialCursor,
  loadMore,
  emptyMessage,
}: {
  initialLogs: any[];
  initialCursor: string | null;
  loadMore: (cursor: string) => Promise<Page>;
  emptyMessage?: string;
}) {
  const [logs, setLogs] = useState(initialLogs);
  const [cursor, setCursor] = useState(initialCursor);
  const [isPending, startTransition] = useTransition();

  function handleLoadMore() {
    if (!cursor) return;
    startTransition(async () => {
      const next = await loadMore(cursor);
      setLogs((prev) => {
        const seen = new Set(prev.map((l) => l._id));
        return [...prev, ...next.logs.filter((l) => !seen.has(l._id))];
      });
      setCursor(next.nextCursor);
    });
  }

  return (
    <Box>
      <ActivityFeed logs={logs} emptyMessage={emptyMessage} />
      {cursor && (
        <Box mt="2" px="2" pb="2">
          <LoadMoreButton onClick={handleLoadMore} loading={isPending} />
        </Box>
      )}
    </Box>
  );
}
