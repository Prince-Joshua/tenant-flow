'use client';

import { useFormState } from 'react-dom';
import { Box, Flex, Grid, Input, Stack, Text, Textarea } from '@chakra-ui/react';
import { generateDocumentAction } from '@/server/actions/documents';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { inputStyle, nativeSelectCss } from '@/lib/inputStyles';

const TONES = ['professional', 'casual', 'persuasive', 'technical'];
const LENGTHS = ['short', 'medium', 'long'];

export default function GenerateDocumentForm() {
  const [state, formAction] = useFormState(generateDocumentAction, undefined);

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
        <Flex gap="3" justify="flex-end">
          <SubmitButton size="sm" bg="violet.600" color="white" borderRadius="lg" _hover={{ bg: 'violet.500' }}>Generate</SubmitButton>
        </Flex>
      </Stack>
    </form>
  );
}
