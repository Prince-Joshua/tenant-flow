import { Box, Flex, Text } from "@chakra-ui/react";
export default function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <Flex justify="space-between" align="flex-start" mb="8">
      <Box>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="text.primary"
          letterSpacing="tight"
          mb="1"
        >
          {title}
        </Text>
        {subtitle && (
          <Text fontSize="sm" color="text.muted">
            {subtitle}
          </Text>
        )}
      </Box>
      {action && <Box flexShrink={0}>{action}</Box>}
    </Flex>
  );
}
