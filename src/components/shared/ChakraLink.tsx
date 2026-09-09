import Link from 'next/link';
import { Box, BoxProps } from '@chakra-ui/react';

interface ChakraLinkProps extends BoxProps {
  href: string;
}

/** Chakra v3's `as={Link}` polymorphic prop loses its `href` typing here,
 * and wrapping next/link with the `chakra()` factory breaks Next's build-time
 * "collect page data" step (an ESM/CJS interop bug in that bundling pass).
 * Wrapping a styled Box *inside* a plain next/link sidesteps both. */
export function ChakraLink({ href, children, ...boxProps }: ChakraLinkProps) {
  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box {...boxProps}>{children}</Box>
    </Link>
  );
}
