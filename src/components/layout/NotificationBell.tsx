"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import type { NotificationItem } from "@/server/data/notifications";
import { loadMoreNotificationsAction } from "@/server/actions/pagination";
import { LoadMoreButton } from "@/components/shared/LoadMoreButton";

// Mirrors NOTIFICATIONS_PAGE_SIZE (server-only module, so not imported here).
const PAGE_SIZE = 30;
import {
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "@/server/actions/notifications";

const TYPE_COLOR: Record<string, string> = {
  announcement: "violet.400",
  system: "sky.400",
  billing: "amber.400",
  invite: "emerald.400",
  promo: "pink.400",
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationBell({
  initialNotifications,
  includeOrg = true,
}: {
  initialNotifications: NotificationItem[];
  includeOrg?: boolean;
}) {
  const [items, setItems] = useState(initialNotifications);
  // A full first page means there may be older notifications to fetch.
  const [cursor, setCursor] = useState<string | null>(
    initialNotifications.length >= PAGE_SIZE
      ? initialNotifications[initialNotifications.length - 1].cursor
      : null,
  );
  const [isLoadingMore, startLoadMore] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems((prev) => {
      // Keep any older pages already loaded; refresh the newest page.
      const fresh = new Set(initialNotifications.map((n) => n.id));
      const oldest = initialNotifications[initialNotifications.length - 1];
      const older = oldest
        ? prev.filter(
            (n) => !fresh.has(n.id) && n.createdAt < oldest.createdAt,
          )
        : [];
      return [...initialNotifications, ...older];
    });
  }, [initialNotifications]);

  function handleLoadMore() {
    if (!cursor) return;
    startLoadMore(async () => {
      const next = await loadMoreNotificationsAction(cursor, includeOrg);
      setItems((prev) => {
        const seen = new Set(prev.map((n) => n.id));
        return [...prev, ...next.items.filter((n) => !seen.has(n.id))];
      });
      setCursor(next.nextCursor);
    });
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unreadCount = items.filter((n) => !n.isRead).length;

  function handleOpen(item: NotificationItem) {
    if (!item.isRead) {
      setItems((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
      );
      startTransition(async () => {
        await markNotificationReadAction(item.id);
        router.refresh();
      });
    }
    setIsOpen(false);
    if (item.link) router.push(item.link);
  }

  function handleMarkAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    startTransition(async () => {
      await markAllNotificationsReadAction();
      router.refresh();
    });
  }

  return (
    <Box position="relative" ref={ref}>
      <Button
        onClick={() => setIsOpen((v) => !v)}
        position="relative"
        minW="9"
        h="9"
        p="0"
        bg="transparent"
        border="1px solid"
        borderColor="border.subtle"
        borderRadius="lg"
        color="text.primary"
        cursor="pointer"
        fontSize="md"
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <Box
            position="absolute"
            top="-1"
            right="-1"
            minW="4"
            h="4"
            px="1"
            borderRadius="full"
            bg="rose.500"
            color="white"
            fontSize="9px"
            fontWeight="bold"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Box>
        )}
      </Button>

      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 8px)"
          right="0"
          w="340px"
          maxW="90vw"
          maxH="420px"
          overflowY="auto"
          bg="bg.elevated"
          border="1px solid"
          borderColor="border.subtle"
          borderRadius="xl"
          boxShadow="0 12px 32px rgba(0,0,0,0.4)"
          zIndex="300"
        >
          <Flex
            align="center"
            justify="space-between"
            px="4"
            py="3"
            borderBottom="1px solid"
            borderColor="border.subtle"
            position="sticky"
            top="0"
            bg="bg.elevated"
          >
            <Text fontSize="sm" fontWeight="semibold" color="text.primary">
              Notifications
            </Text>
            {unreadCount > 0 && (
              <Text
                as="button"
                onClick={handleMarkAllRead}
                fontSize="xs"
                color="violet.400"
                cursor="pointer"
                _hover={{ color: "violet.300" }}
              >
                Mark all read
              </Text>
            )}
          </Flex>

          {items.length === 0 ? (
            <Text fontSize="sm" color="text.muted" px="4" py="6" textAlign="center">
              You&apos;re all caught up.
            </Text>
          ) : (
            items.map((item) => (
              <Box
                key={item.id}
                as="button"
                onClick={() => handleOpen(item)}
                w="full"
                textAlign="left"
                px="4"
                py="3"
                borderBottom="1px solid"
                borderColor="border.subtle"
                bg={item.isRead ? "transparent" : "brand.subtle"}
                cursor="pointer"
                _hover={{ bg: "bg.muted" }}
              >
                <Flex align="center" gap="2" mb="1">
                  <Box
                    w="1.5"
                    h="1.5"
                    borderRadius="full"
                    bg={TYPE_COLOR[item.type] ?? "text.muted"}
                    flexShrink={0}
                  />
                  <Text
                    fontSize="sm"
                    fontWeight={item.isRead ? "medium" : "semibold"}
                    color="text.primary"
                    truncate
                  >
                    {item.title}
                  </Text>
                </Flex>
                {item.body && (
                  <Text fontSize="xs" color="text.secondary" mb="1" lineClamp={2}>
                    {item.body}
                  </Text>
                )}
                <Text fontSize="xs" color="text.muted">
                  {timeAgo(item.createdAt)}
                </Text>
              </Box>
            ))
          )}
          {cursor && (
            <Box p="2">
              <LoadMoreButton
                onClick={handleLoadMore}
                loading={isLoadingMore}
                label="Load older"
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
