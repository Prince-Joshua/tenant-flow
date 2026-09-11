"use client";

import { useActionState, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Box,
  Flex,
  Grid,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { generateDocumentAction } from "@/server/actions/documents";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { inputStyle, nativeSelectCss } from "@/lib/inputStyles";

const TONES = ["professional", "casual", "persuasive", "technical"];
const LENGTHS = ["short", "medium", "long"];

interface TemplateOption {
  _id: string;
  title: string;
}

interface QuickStart {
  label: string;
  title: string;
  prompt: string;
  tone: (typeof TONES)[number];
  length: (typeof LENGTHS)[number];
}

// Fast starting points for common business documents. Clicking one fills
// Title/Prompt/Tone/Length below — all still fully editable afterward.
// Only the first 4 show by default; "More" reveals the rest, animated.
const QUICK_STARTS: QuickStart[] = [
  {
    label: "Business Proposal",
    title: "Business Proposal",
    prompt:
      "A business proposal outlining the problem, proposed solution, timeline, and expected outcomes for [project/client name]",
    tone: "persuasive",
    length: "long",
  },
  {
    label: "Meeting Summary",
    title: "Meeting Summary",
    prompt:
      "A summary of key discussion points, decisions made, and action items from today's meeting",
    tone: "professional",
    length: "medium",
  },
  {
    label: "Project Status Update",
    title: "Project Status Update",
    prompt:
      "A status update covering progress this period, current blockers, and next steps for [project name]",
    tone: "professional",
    length: "medium",
  },
  {
    label: "Announcement",
    title: "Company Announcement",
    prompt:
      "An announcement introducing [product/update] to our audience, highlighting key benefits and why it matters",
    tone: "persuasive",
    length: "medium",
  },
  {
    label: "Internal Memo",
    title: "Internal Memo",
    prompt:
      "An internal memo informing the team about [topic], including what's changing and what they need to do",
    tone: "professional",
    length: "short",
  },
  {
    label: "Client Follow-up",
    title: "Client Follow-up Email",
    prompt:
      "A friendly follow-up email to a client after our recent conversation, recapping next steps",
    tone: "casual",
    length: "short",
  },
  {
    label: "Job Description",
    title: "Job Description",
    prompt:
      "A job description for a [role title] position, including responsibilities, qualifications, and what we offer",
    tone: "professional",
    length: "long",
  },
  {
    label: "SOP / Policy",
    title: "Standard Operating Procedure",
    prompt:
      "A standard operating procedure documenting the step-by-step process for [process name]",
    tone: "technical",
    length: "long",
  },
];

const VISIBLE_COUNT = 4;

export default function GenerateDocumentForm({
  templates = [],
}: {
  templates?: TemplateOption[];
}) {
  const [state, formAction] = useActionState(generateDocumentAction, undefined);
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [showMore, setShowMore] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  function applyQuickStart(qs: QuickStart) {
    setTitle(qs.title);
    setPrompt(qs.prompt);
    setTone(qs.tone);
    setLength(qs.length);
    setActiveLabel(qs.label);
  }

  const primary = QUICK_STARTS.slice(0, VISIBLE_COUNT);
  const rest = QUICK_STARTS.slice(VISIBLE_COUNT);

  return (
    <form action={formAction}>
      <Stack gap="4">
        {state?.error && (
          <Text fontSize="sm" color="rose.400">
            {state.error}
          </Text>
        )}

        <Box>
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="text.secondary"
            mb="1.5"
          >
            Quick start
          </Text>
          <Flex gap="2" wrap="wrap" mb="2">
            {primary.map((qs) => (
              <QuickStartChip
                key={qs.label}
                qs={qs}
                active={activeLabel === qs.label}
                onClick={() => applyQuickStart(qs)}
              />
            ))}
            <motion.button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              whileTap={{ scale: 0.96 }}
              style={{
                fontSize: "13px",
                color: "var(--chakra-colors-text-muted)",
                background: "transparent",
                border: "1px dashed var(--chakra-colors-border-default)",
                borderRadius: "999px",
                padding: "6px 14px",
                cursor: "pointer",
              }}
            >
              {showMore ? "− Less" : `+ ${rest.length} more`}
            </motion.button>
          </Flex>
          <AnimatePresence>
            {showMore && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{ overflow: "hidden" }}
              >
                <Flex gap="2" wrap="wrap" pt="1">
                  {rest.map((qs, i) => (
                    <motion.div
                      key={qs.label}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                    >
                      <QuickStartChip
                        qs={qs}
                        active={activeLabel === qs.label}
                        onClick={() => applyQuickStart(qs)}
                      />
                    </motion.div>
                  ))}
                </Flex>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        <Box>
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="text.secondary"
            mb="1.5"
          >
            Title
          </Text>
          <Input
            name="title"
            placeholder="e.g. Product launch announcement"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            {...inputStyle}
          />
        </Box>
        <Box>
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="text.secondary"
            mb="1.5"
          >
            Prompt
          </Text>
          <Textarea
            name="prompt"
            placeholder="Describe what you want to write about..."
            minH="100px"
            required
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            {...inputStyle}
          />
        </Box>
        <Grid templateColumns="1fr 1fr" gap="4">
          <Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="text.secondary"
              mb="1.5"
              textTransform="capitalize"
            >
              Tone
            </Text>
            <select
              name="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              style={{ ...nativeSelectCss, width: "100%" }}
            >
              {TONES.map((o) => (
                <option key={o} value={o} style={{ background: "#111827" }}>
                  {o.charAt(0).toUpperCase() + o.slice(1)}
                </option>
              ))}
            </select>
          </Box>
          <Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="text.secondary"
              mb="1.5"
              textTransform="capitalize"
            >
              Length
            </Text>
            <select
              name="length"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              style={{ ...nativeSelectCss, width: "100%" }}
            >
              {LENGTHS.map((o) => (
                <option key={o} value={o} style={{ background: "#111827" }}>
                  {o.charAt(0).toUpperCase() + o.slice(1)}
                </option>
              ))}
            </select>
          </Box>
        </Grid>
        {templates.length > 0 && (
          <Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="text.secondary"
              mb="1.5"
            >
              Template (optional)
            </Text>
            <select
              name="templateId"
              defaultValue=""
              style={{ ...nativeSelectCss, width: "100%" }}
            >
              <option value="" style={{ background: "#111827" }}>
                No template
              </option>
              {templates.map((t) => (
                <option
                  key={t._id}
                  value={t._id}
                  style={{ background: "#111827" }}
                >
                  {t.title}
                </option>
              ))}
            </select>
          </Box>
        )}
        <Flex gap="3" justify="space-between" align="center">
          <Text
            as="label"
            fontSize="sm"
            color="text.secondary"
            display="flex"
            alignItems="center"
            gap="2"
          >
            <input type="checkbox" name="asDraft" />
            Save as draft (don&apos;t mark as final)
          </Text>
          <SubmitButton
            size="sm"
            bg="violet.600"
            color="white"
            borderRadius="lg"
            _hover={{ bg: "violet.500" }}
          >
            Generate
          </SubmitButton>
        </Flex>
      </Stack>
    </form>
  );
}

function QuickStartChip({
  qs,
  active,
  onClick,
}: {
  qs: QuickStart;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15 }}
      style={{
        fontSize: "13px",
        fontWeight: 500,
        color: active
          ? "white"
          : "var(--chakra-colors-text-secondary)",
        background: active ? "var(--chakra-colors-violet-600)" : "transparent",
        border: `1px solid ${
          active
            ? "var(--chakra-colors-violet-600)"
            : "var(--chakra-colors-border-default)"
        }`,
        borderRadius: "999px",
        padding: "6px 14px",
        cursor: "pointer",
      }}
    >
      {qs.label}
    </motion.button>
  );
}
