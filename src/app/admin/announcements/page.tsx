import { Box, Flex, Text } from "@chakra-ui/react";
import PageHeader from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared";
import AnnouncementForm from "@/components/admin/AnnouncementForm";
import { getGlobalAnnouncements } from "@/server/data/notifications";
import { cardProps } from "@/lib/cardStyles";
import { LuBell } from "react-icons/lu";

export default async function AdminAnnouncementsPage() {
  const announcementDocs = await getGlobalAnnouncements();
  const announcements = JSON.parse(JSON.stringify(announcementDocs));

  return (
    <>
      <PageHeader
        title="Announcements"
        subtitle="Published here reach every user on the platform"
      />

      <Box
        {...cardProps}
        p="5"
        mb="8"
      >
        <AnnouncementForm />
      </Box>

      <Text fontSize="sm" fontWeight="semibold" color="text.primary" mb="3">
        History
      </Text>

      {!announcements.length ? (
        <EmptyState icon={<LuBell />} title="No announcements published yet" />
      ) : (
        <Flex direction="column" gap="2">
          {announcements.map((a: any) => (
            <Box
              key={a._id}
              {...cardProps}
              p="4"
            >
              <Text fontSize="sm" fontWeight="semibold" color="text.primary">
                {a.title}
              </Text>
              {a.body && (
                <Text fontSize="sm" color="text.secondary" mt="1">
                  {a.body}
                </Text>
              )}
              <Text fontSize="xs" color="text.muted" mt="2">
                {a.createdBy?.name ? `${a.createdBy.name} · ` : ""}
                {new Date(a.createdAt).toLocaleString()} ·{" "}
                {a.readBy?.length ?? 0} read
              </Text>
            </Box>
          ))}
        </Flex>
      )}
    </>
  );
}
