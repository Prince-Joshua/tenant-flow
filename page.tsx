import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { ChakraLink } from "@/components/shared/ChakraLink";

const LAST_UPDATED = "September 10, 2026";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Who these Terms are with",
    body: (
      <>
        These Terms of Service (&quot;Terms&quot;) are an agreement between you
        (&quot;you&quot; or &quot;User&quot;) and TenantFlow LLC
        (&quot;TenantFlow,&quot; &quot;we,&quot; &quot;us,&quot; or
        &quot;our&quot;), governing your access to and use of the TenantFlow
        application, including our website, dashboard, APIs, and any related
        services (collectively, the &quot;Service&quot;). By creating an account
        or otherwise using the Service, you agree to be bound by these Terms.
      </>
    ),
  },
  {
    title: "2. Accounts and organizations",
    body: (
      <>
        When you register, you create both a personal account and an
        organization (&quot;workspace&quot;). You are responsible for
        maintaining the confidentiality of your login credentials and for all
        activity that occurs under your account. As an organization owner or
        admin, you are responsible for the members you invite and the access
        levels you grant them. You must provide accurate information when
        registering and keep it up to date.
      </>
    ),
  },
  {
    title: "3. Plans, usage limits, and billing",
    body: (
      <Stack gap="3">
        <Text>
          TenantFlow is offered on Free, Pro, and Enterprise plans. Each plan
          includes a specific document-generation allowance per billing cycle
          and a limit on the number of members per organization, as shown on our{" "}
          <ChakraLink href="/dashboard/billing" color="violet.400">
            Billing page
          </ChakraLink>
          . Usage resets at the start of each billing cycle and does not roll
          over.
        </Text>
        <Text>
          Paid plans are billed in advance on a recurring basis through our
          payment processor, Stripe. By subscribing to a paid plan, you
          authorize us to charge your payment method automatically at the start
          of each billing cycle until you cancel.
        </Text>
        <Text>
          When you upgrade from Free to a paid plan, your document usage for the
          current cycle resets to zero and your new plan&apos;s limits apply
          immediately. Any unused allowance from your previous plan is not
          carried over, refunded, or credited.
        </Text>
        <Text>
          You may cancel a paid subscription at any time from the Billing page.
          Upon cancellation, your organization reverts to the Free plan and its
          associated limits; access to paid-tier features and usage above the
          Free plan&apos;s limits ends at that point. Except where required by
          law, fees already paid are non-refundable.
        </Text>
      </Stack>
    ),
  },
  {
    title: "4. AI-generated content",
    body: (
      <>
        The Service includes a document-generation feature powered by a
        third-party AI model (Google Gemini). AI-generated content may be
        inaccurate, incomplete, or unsuitable for your intended purpose. You are
        solely responsible for reviewing, editing, and verifying any
        AI-generated content before relying on or distributing it. We do not
        guarantee the accuracy, legality, or fitness of AI-generated output for
        any particular use, including as legal, financial, or professional
        advice.
      </>
    ),
  },
  {
    title: "5. Acceptable use",
    body: (
      <>
        You agree not to use the Service to violate any applicable law, infringe
        on the rights of others, transmit malicious code, attempt to gain
        unauthorized access to any part of the Service, or generate content that
        is unlawful, defamatory, or abusive. We reserve the right to suspend or
        terminate accounts that violate this section.
      </>
    ),
  },
  {
    title: "6. Data and third-party services",
    body: (
      <>
        We store your account and organization data using MongoDB Atlas, process
        payments through Stripe, and send transactional emails (verification,
        password reset, invitations) through Brevo. By using the Service, you
        acknowledge that your data is processed by these providers on our
        behalf, subject to their respective terms and security practices.
      </>
    ),
  },
  {
    title: "7. Termination",
    body: (
      <>
        You may stop using the Service and delete your account at any time. We
        may suspend or terminate your access to the Service if you violate these
        Terms, fail to pay applicable fees, or if we discontinue the Service. We
        will make reasonable efforts to notify you before terminating an account
        other than for violations of Section 5.
      </>
    ),
  },
  {
    title: "8. Disclaimers and limitation of liability",
    body: (
      <>
        The Service is provided &quot;as is&quot; and &quot;as available&quot;
        without warranties of any kind, whether express or implied. To the
        fullest extent permitted by law, TenantFlow LLC will not be liable for
        any indirect, incidental, special, or consequential damages, or for any
        loss of data, revenue, or profits, arising from your use of the Service.
      </>
    ),
  },
  {
    title: "9. Changes to these Terms",
    body: (
      <>
        We may update these Terms from time to time. If we make material
        changes, we will update the &quot;Last updated&quot; date below and,
        where appropriate, notify you by email. Continued use of the Service
        after changes take effect constitutes acceptance of the revised Terms.
      </>
    ),
  },
  {
    title: "10. Governing law",
    body: (
      <>
        These Terms are governed by and construed in accordance with the laws of
        the Federal Republic of Nigeria, without regard to its conflict-of-law
        provisions. Any disputes arising from these Terms or the Service will be
        subject to the exclusive jurisdiction of the courts of Nigeria.
      </>
    ),
  },
  {
    title: "11. Contact",
    body: (
      <>
        If you have questions about these Terms, contact us at{" "}
        <ChakraLink href="mailto:support@tenantflow.dev" color="violet.400">
          support@tenantflow.dev
        </ChakraLink>
        .
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <Box minH="100vh" bg="bg.canvas">
      <Flex
        as="nav"
        justify="space-between"
        align="center"
        px={{ base: "5", md: "10" }}
        py="5"
        borderBottom="1px solid"
        borderColor="border.subtle"
      >
        <Flex align="center" gap="2.5">
          <ChakraLink href="/" display="flex" alignItems="center" gap="2.5">
            <Box
              w="8"
              h="8"
              bg="violet.600"
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontWeight="bold"
              color="white"
              style={{ boxShadow: "0 0 16px rgba(139,92,246,0.4)" }}
            >
              T
            </Box>
            <Text fontSize="sm" fontWeight="bold" color="text.primary">
              TenantFlow
            </Text>
          </ChakraLink>
        </Flex>
        <ChakraLink
          href="/register"
          fontSize="sm"
          fontWeight="semibold"
          color="white"
          bg="violet.600"
          borderRadius="lg"
          px="4"
          py="2"
          _hover={{ bg: "violet.500" }}
        >
          Get started
        </ChakraLink>
      </Flex>

      <Box maxW="720px" mx="auto" px="5" py={{ base: "12", md: "16" }}>
        <Text
          as="h1"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
          color="text.primary"
          mb="2"
        >
          Terms of Service
        </Text>
        <Text fontSize="sm" color="text.muted" mb="10">
          Last updated: {LAST_UPDATED}
        </Text>

        <Stack gap="8">
          {sections.map((s) => (
            <Box key={s.title}>
              <Text
                fontSize="md"
                fontWeight="semibold"
                color="text.primary"
                mb="2"
              >
                {s.title}
              </Text>
              <Box fontSize="sm" color="text.secondary" lineHeight="1.7">
                {s.body}
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
