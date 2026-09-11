import { Box, Flex, Text, Badge } from "@chakra-ui/react";

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: string;
  accent?: boolean;
}) {
  return (
    <Box
      bg="bg.surface"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="xl"
      p="5"
      transition="all 0.2s"
      _hover={{ borderColor: "border.default" }}
    >
      <Flex justify="space-between" align="flex-start">
        <Box>
          <Text
            fontSize="xs"
            color="text.muted"
            fontWeight="medium"
            textTransform="uppercase"
            letterSpacing="wider"
            mb="2"
          >
            {label}
          </Text>
          <Text
            fontSize="3xl"
            fontWeight="bold"
            color={accent ? "violet.400" : "text.primary"}
            lineHeight="1"
            mb="1"
          >
            {value}
          </Text>
          {sub && (
            <Text fontSize="xs" color="text.muted" mt="1">
              {sub}
            </Text>
          )}
        </Box>
        {icon && (
          <Box bg="brand.subtle" borderRadius="lg" p="2.5" fontSize="lg">
            {icon}
          </Box>
        )}
      </Flex>
    </Box>
  );
}

export function UsageBar({
  label,
  used,
  total,
}: {
  label: string;
  used: number;
  total: number;
}) {
  const isUnlimited = total >= 999999;
  const pct = isUnlimited ? 100 : Math.min((used / total) * 100, 100);
  const barColor = isUnlimited
    ? "emerald.500"
    : pct >= 90
      ? "rose.500"
      : pct >= 70
        ? "amber.500"
        : "violet.500";
  return (
    <Box>
      <Flex justify="space-between" mb="1.5">
        <Text fontSize="xs" color="text.secondary" fontWeight="medium">
          {label}
        </Text>
        <Text fontSize="xs" color="text.muted">
          {isUnlimited ? `${used} / Unlimited` : `${used} / ${total}`}
        </Text>
      </Flex>
      <Box bg="bg.overlay" borderRadius="full" h="1.5" overflow="hidden">
        <Box
          h="full"
          borderRadius="full"
          bg={barColor}
          width={`${pct}%`}
          transition="width 0.4s ease"
        />
      </Box>
    </Box>
  );
}

export function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    owner: "violet",
    admin: "blue",
    member: "gray",
  };
  const c = colors[role] || "gray";
  return (
    <Badge
      px="2"
      py="0.5"
      borderRadius="md"
      fontSize="xs"
      textTransform="capitalize"
      bg={`${c}.900`}
      color={`${c}.300`}
    >
      {role}
    </Badge>
  );
}

export function PlanBadge({ plan }: { plan: string }) {
  const cfg: Record<string, { label: string; colorPalette: string }> = {
    free: { label: "Free", colorPalette: "gray" },
    pro: { label: "Pro", colorPalette: "purple" },
    enterprise: { label: "Enterprise", colorPalette: "yellow" },
  };
  const { label, colorPalette } = cfg[plan] || cfg.free;
  return (
    <Badge
      colorPalette={colorPalette}
      variant="subtle"
      borderRadius="full"
      px="2"
    >
      {label}
    </Badge>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: string;
  title: string;
  description?: string;
}) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py="16"
      gap="3"
      textAlign="center"
    >
      {icon && (
        <Text fontSize="3xl" opacity={0.3} mb="1">
          {icon}
        </Text>
      )}
      <Text fontSize="md" fontWeight="semibold" color="text.secondary">
        {title}
      </Text>
      {description && (
        <Text fontSize="sm" color="text.muted" maxW="300px">
          {description}
        </Text>
      )}
    </Box>
  );
}

export function PageSpinner() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      bg="bg.canvas"
    >
      <Box
        w="8"
        h="8"
        borderRadius="full"
        border="2px solid"
        borderColor="border.default"
        borderTopColor="violet.500"
        style={{ animation: "spin 0.7s linear infinite" }}
      />
    </Box>
  );
}

const actionConfig: Record<
  string,
  { icon: string; color: string; label: string }
> = {
  DOCUMENT_GENERATED: {
    icon: "✦",
    color: "violet.400",
    label: "Generated document",
  },
  DOCUMENT_UPDATED: { icon: "◈", color: "sky.400", label: "Updated document" },
  DOCUMENT_DELETED: { icon: "○", color: "rose.400", label: "Deleted document" },
  DOCUMENT_REGENERATED: {
    icon: "↻",
    color: "amber.400",
    label: "Regenerated document",
  },
  MEMBER_INVITED: { icon: "◇", color: "emerald.400", label: "Invited member" },
  MEMBER_REMOVED: { icon: "✕", color: "rose.400", label: "Removed member" },
  MEMBER_ROLE_UPDATED: { icon: "◈", color: "sky.400", label: "Updated role" },
  CONTACT_ADDED: { icon: "☰", color: "emerald.400", label: "Added contact" },
  CONTACT_REMOVED: { icon: "✕", color: "rose.400", label: "Removed contact" },
  ORG_UPDATED: {
    icon: "⬡",
    color: "violet.400",
    label: "Updated organization",
  },
};

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function ActivityFeed({
  logs = [],
  emptyMessage = "No activity yet",
}: {
  logs?: any[];
  emptyMessage?: string;
}) {
  if (!logs.length)
    return (
      <Box py="8" textAlign="center">
        <Text fontSize="sm" color="text.muted">
          {emptyMessage}
        </Text>
      </Box>
    );
  return (
    <Box display="flex" flexDirection="column" gap="1">
      {logs.map((log: any) => {
        const cfg = actionConfig[log.action] || {
          icon: "○",
          color: "text.muted",
          label: log.action,
        };
        return (
          <Flex
            key={log._id}
            align="center"
            gap="3"
            px="3"
            py="2.5"
            borderRadius="lg"
            _hover={{ bg: "bg.elevated" }}
            transition="bg 0.15s"
          >
            <Text fontSize="xs" color={cfg.color} flexShrink={0}>
              {cfg.icon}
            </Text>
            <Box flex="1" minW="0">
              <Flex align="center" gap="1.5" flexWrap="wrap">
                <Text fontSize="sm" fontWeight="medium" color="text.secondary">
                  {log.userName}
                </Text>
                <Text fontSize="sm" color="text.muted">
                  {cfg.label}
                </Text>
                {log.meta?.title && (
                  <Text fontSize="sm" color="text.secondary" fontStyle="italic">
                    "{String(log.meta.title)}"
                  </Text>
                )}
              </Flex>
            </Box>
            <Text fontSize="xs" color="text.muted" flexShrink={0}>
              {timeAgo(log.createdAt)}
            </Text>
          </Flex>
        );
      })}
    </Box>
  );
}
