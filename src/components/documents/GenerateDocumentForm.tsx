'use client';

import { useActionState } from 'react';
import { Box, Flex, Grid, Input, Stack, Text, Textarea } from '@chakra-ui/react';
import { generateDocumentAction } from '@/server/actions/documents';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { inputStyle, nativeSelectCss } from '@/lib/inputStyles';

const TONES = ['professional', 'casual', 'persuasive', 'technical'];
const LENGTHS = ['short', 'medium', 'long'];

interface TemplateOption {
  _id: string;
  title: string;
}

export default function GenerateDocumentForm({
  templates = [],
}: {
  templates?: TemplateOption[];
}) {
  const [state, formAction] = useActionState(generateDocumentAction, undefined);

  return (
    <form action={formAction}>
      <Stack gap="4">
        {state?.error && <Text fontSize="sm" color="rose.400">{state.error}</Text>}
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="text.secondary" mb="1.5">Title</Text>
          <Input name="title" placeholder="e.g. Product launch announcement" required {...inputStyle} />
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="text.secondary" mb="1.5">Prompt</Text>
          <Textarea name="prompt" placeholder="Describe what you want to write about..." minH="100px" required {...inputStyle} />
        </Box>
        <Grid templateColumns="1fr 1fr" gap="4">
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="text.secondary" mb="1.5" textTransform="capitalize">Tone</Text>
            <select name="tone" defaultValue="professional" style={{ ...nativeSelectCss, width: '100%' }}>
              {TONES.map((o) => <option key={o} value={o} style={{ background: '#111827' }}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
            </select>
          </Box>
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="text.secondary" mb="1.5" textTransform="capitalize">Length</Text>
            <select name="length" defaultValue="medium" style={{ ...nativeSelectCss, width: '100%' }}>
              {LENGTHS.map((o) => <option key={o} value={o} style={{ background: '#111827' }}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
            </select>
          </Box>
        </Grid>
        {templates.length > 0 && (
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="text.secondary" mb="1.5">Template (optional)</Text>
            <select name="templateId" defaultValue="" style={{ ...nativeSelectCss, width: '100%' }}>
              <option value="" style={{ background: '#111827' }}>No template</option>
              {templates.map((t) => (
                <option key={t._id} value={t._id} style={{ background: '#111827' }}>{t.title}</option>
              ))}
            </select>
          </Box>
        )}
        <Flex gap="3" justify="space-between" align="center">
          <Text as="label" fontSize="sm" color="text.secondary" display="flex" alignItems="center" gap="2">
            <input type="checkbox" name="asDraft" />
            Save as draft (don&apos;t mark as final)
          </Text>
          <SubmitButton size="sm" bg="violet.600" color="white" borderRadius="lg" _hover={{ bg: 'violet.500' }}>Generate</SubmitButton>
        </Flex>
      </Stack>
    </form>
  );
}
