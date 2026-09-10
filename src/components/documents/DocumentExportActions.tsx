"use client";

import { useState } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useDocumentActionMenu } from "./DocumentActionsMenuContext";

const PDF_MARGIN = 15;
const PDF_LINE_HEIGHT = 7;

export default function DocumentExportActions({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const { isOpen, toggle, close } = useDocumentActionMenu("export");
  const [copied, setCopied] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingWord, setExportingWord] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      close();
    } catch (err) {
      console.error("Copy to clipboard failed:", err);
    }
  }

  async function handleDownloadPdf() {
    setExportingPdf(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const usableWidth = pageWidth - PDF_MARGIN * 2;

      let cursorY = PDF_MARGIN;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      const titleLines = doc.splitTextToSize(title, usableWidth);
      doc.text(titleLines, PDF_MARGIN, cursorY);
      cursorY += titleLines.length * PDF_LINE_HEIGHT + 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const bodyLines = doc.splitTextToSize(content, usableWidth);

      for (const line of bodyLines) {
        if (cursorY > pageHeight - PDF_MARGIN) {
          doc.addPage();
          cursorY = PDF_MARGIN;
        }
        doc.text(line, PDF_MARGIN, cursorY);
        cursorY += PDF_LINE_HEIGHT;
      }

      doc.save(`${title || "document"}.pdf`);
      close();
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setExportingPdf(false);
    }
  }

  async function handleDownloadWord() {
    setExportingWord(true);
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } =
        await import("docx");

      const paragraphs = content
        .split(/\n+/)
        .filter((line) => line.trim().length > 0)
        .map(
          (line) =>
            new Paragraph({
              children: [new TextRun(line)],
              spacing: { after: 200 },
            }),
        );

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: title,
                heading: HeadingLevel.HEADING_1,
                spacing: { after: 300 },
              }),
              ...paragraphs,
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title || "document"}.docx`;
      link.click();
      URL.revokeObjectURL(url);
      close();
    } catch (err) {
      console.error("Word export failed:", err);
    } finally {
      setExportingWord(false);
    }
  }

  const menuItemStyle = {
    as: "button" as const,
    type: "button" as const,
    display: "block",
    width: "100%",
    textAlign: "left" as const,
    fontSize: "sm",
    color: "text.secondary",
    px: "3",
    py: "2",
    borderRadius: "md",
    _hover: { bg: "bg.elevated", color: "text.primary" },
  };

  return (
    <Box position="relative">
      <Button
        onClick={toggle}
        aria-expanded={isOpen}
        variant="ghost"
        display="inline-flex"
        alignItems="center"
        cursor="pointer"
        fontSize="sm"
        fontWeight="semibold"
        color="text.secondary"
        bg="bg.surface"
        border="1px solid"
        borderColor="border.default"
        borderRadius="lg"
        px="4"
        py="1.5"
        h="auto"
        _hover={{ borderColor: "violet.500", color: "text.primary" }}
      >
        ⬇ Export
      </Button>
      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 6px)"
          right="0"
          minW="180px"
          bg="bg.surface"
          border="1px solid"
          borderColor="border.default"
          borderRadius="lg"
          p="1"
          boxShadow="0 8px 24px rgba(0,0,0,0.35)"
          zIndex="10"
        >
          <Flex justify="flex-end" mb="1">
            <Button
              size="2xs"
              variant="ghost"
              onClick={close}
              fontSize="xs"
              color="text.muted"
              px="1"
              minW="auto"
              h="auto"
              _hover={{ color: "text.primary", bg: "bg.elevated" }}
              aria-label="Close export menu"
            >
              ✕
            </Button>
          </Flex>
          <Text {...menuItemStyle} onClick={handleCopy}>
            {copied ? "✓ Copied to clipboard" : "⧉ Copy to clipboard"}
          </Text>
          <Text
            {...menuItemStyle}
            onClick={handleDownloadPdf}
            opacity={exportingPdf ? 0.5 : 1}
            pointerEvents={exportingPdf ? "none" : "auto"}
          >
            {exportingPdf ? "Generating PDF…" : "⬇ Download as PDF"}
          </Text>
          <Text
            {...menuItemStyle}
            onClick={handleDownloadWord}
            opacity={exportingWord ? 0.5 : 1}
            pointerEvents={exportingWord ? "none" : "auto"}
          >
            {exportingWord ? "Generating Word doc…" : "⬇ Download as Word"}
          </Text>
        </Box>
      )}
    </Box>
  );
}
