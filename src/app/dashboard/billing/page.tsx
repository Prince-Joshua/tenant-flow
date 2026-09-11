import { Box, Flex, Grid, Link as ChakraLink, Text } from "@chakra-ui/react";
import { requireTenant } from "@/server/data/tenant";
import { getBillingInfo } from "@/server/data/billing";
import PageHeader from "@/components/layout/PageHeader";
import { UsageBar } from "@/components/shared";
import { SubmitButton } from "@/components/shared/SubmitButton";
import {
  createCheckoutAction,
  createPortalAction,
} from "@/server/actions/billing";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { org, membership } = await requireTenant();
  const billing = await getBillingInfo(org);
  const isOwner = membership.role === "owner";

  return (
    <>
      <PageHeader
        title="Billing"
        subtitle="Manage your plan and view invoices"
      />
      {error && (
        <Box
          bg="rgba(244,63,94,0.08)"
          border="1px solid"
          borderColor="rose.500"
          borderRadius="lg"
          px="4"
          py="3"
          mb="6"
        >
          <Text fontSize="sm" color="rose.400">
            {error}
          </Text>
        </Box>
      )}

      <Box
        bg="bg.surface"
        border="1px solid"
        borderColor="border.subtle"
        borderRadius="xl"
        p="6"
        mb="6"
      >
        <Flex justify="space-between" align="center" mb="4">
          <Box>
            <Text
              fontSize="xs"
              color="text.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              mb="1"
            >
              Current plan
            </Text>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="text.primary"
              textTransform="capitalize"
            >
              {billing.plan}
            </Text>
          </Box>
          {isOwner && billing.plan !== "free" && (
            <form action={createPortalAction}>
              <SubmitButton
                variant="outline"
                borderColor="border.default"
                color="text.secondary"
                borderRadius="lg"
              >
                Manage billing
              </SubmitButton>
            </form>
          )}
        </Flex>
        <UsageBar
          label="Documents this cycle"
          used={billing.usage.documentsGenerated}
          total={billing.limits.documentsPerCycle}
        />
      </Box>

      {isOwner && (
        <Grid templateColumns="repeat(3, 1fr)" gap="4" mb="6">
          {Object.entries(billing.plans).map(([key, plan]: [string, any]) => (
            <Box
              key={key}
              bg="bg.surface"
              border="1px solid"
              borderColor={
                billing.plan === key ? "violet.500" : "border.subtle"
              }
              borderRadius="xl"
              p="5"
            >
              <Text fontSize="sm" fontWeight="bold" color="text.primary" mb="1">
                {plan.name}
              </Text>
              <Text fontSize="xs" color="text.muted" mb="4">
                {plan.limits.documentsPerCycle >= 999999
                  ? "Unlimited"
                  : plan.limits.documentsPerCycle}{" "}
                docs/cycle ·{" "}
                {plan.limits.membersAllowed >= 999999
                  ? "Unlimited"
                  : plan.limits.membersAllowed}{" "}
                seats
              </Text>
              {key !== "free" && (
                <Text fontSize="xs" color="text.muted" mb="3">
                  Priced in ₦ · shown in your local currency at checkout
                  {key === "enterprise" ? " · starts at this rate" : ""}
                </Text>
              )}
              {billing.plan === key ? (
                <Box textAlign="center" fontSize="sm" color="text.muted" py="2">
                  Current plan
                </Box>
              ) : key === "free" ? null : (
                <form action={createCheckoutAction}>
                  <input type="hidden" name="plan" value={key} />
                  <SubmitButton
                    w="full"
                    size="sm"
                    bg="violet.600"
                    color="white"
                    borderRadius="lg"
                    _hover={{ bg: "violet.500" }}
                  >
                    Upgrade
                  </SubmitButton>
                </form>
              )}
              {key === "enterprise" && (
                <Text
                  fontSize="xs"
                  color="text.muted"
                  textAlign="center"
                  mt="2"
                >
                  Higher volume or a custom contract?{" "}
                  <ChakraLink
                    href="mailto:support@tenantflow.dev?subject=Enterprise%20plan%20inquiry"
                    color="violet.400"
                  >
                    Contact us
                  </ChakraLink>
                </Text>
              )}
            </Box>
          ))}
        </Grid>
      )}

      <Box
        bg="bg.surface"
        border="1px solid"
        borderColor="border.subtle"
        borderRadius="xl"
        p="6"
      >
        <Text fontSize="sm" fontWeight="semibold" color="text.primary" mb="4">
          Invoices
        </Text>
        {!billing.invoices.length ? (
          <Text fontSize="sm" color="text.muted">
            No invoices yet.
          </Text>
        ) : (
          <Flex direction="column" gap="2">
            {billing.invoices.map((inv) => (
              <Flex
                key={inv.id}
                justify="space-between"
                fontSize="sm"
                py="2"
                borderBottom="1px solid"
                borderColor="border.subtle"
              >
                <Text color="text.secondary">
                  {new Date(inv.date).toLocaleDateString()}
                </Text>
                <Text color="text.secondary">
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: inv.currency,
                  }).format(inv.amount)}
                </Text>
                <Text color="text.muted" textTransform="capitalize">
                  {inv.status}
                </Text>
              </Flex>
            ))}
          </Flex>
        )}
      </Box>
    </>
  );
}
