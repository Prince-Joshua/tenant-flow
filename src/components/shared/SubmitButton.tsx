'use client';

import { useFormStatus } from 'react-dom';
import { Button, ButtonProps } from '@chakra-ui/react';

export function SubmitButton({ children, ...props }: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} {...props}>
      {children}
    </Button>
  );
}
