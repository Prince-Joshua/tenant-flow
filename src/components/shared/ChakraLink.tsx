import Link from 'next/link';
import { Box, BoxProps } from '@chakra-ui/react';

interface ChakraLinkProps extends BoxProps {
  href: string;
}


export function ChakraLink({ href, children, ...boxProps }: ChakraLinkProps) {
  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box {...boxProps}>{children}</Box>
    </Link>
  );
}
