import { Box, Text } from "@chakra-ui/react";
import { requireTenant } from "@/server/data/tenant";
import { getOrgContacts } from "@/server/data/contacts";
import PageHeader from "@/components/layout/PageHeader";
import ContactForm from "@/components/contacts/ContactForm";
import ContactsList from "@/components/contacts/ContactsList";

export default async function ContactsPage() {
  const { org, membership } = await requireTenant();
  const contactsRaw = await getOrgContacts(org);
  const contacts = JSON.parse(JSON.stringify(contactsRaw));
  const canManage = ["owner", "admin"].includes(membership.role);

  return (
    <>
      <PageHeader
        title="Contacts"
        subtitle={`${contacts.length} of ${org.limits.contactsAllowed} contacts used`}
      />

      <Text fontSize="sm" color="text.muted" mb="6" maxW="640px">
        Customers and other outside people you deal with, kept private to your
        organization. Save them here to send documents and announcements without
        making anything public or giving them a login.
      </Text>

      {canManage && (
        <Box
          bg="bg.surface"
          border="1px solid"
          borderColor="brand.border"
          borderRadius="xl"
          p="6"
          mb="6"
        >
          <ContactForm />
        </Box>
      )}

      <ContactsList contacts={contacts} canManage={canManage} />
    </>
  );
}
