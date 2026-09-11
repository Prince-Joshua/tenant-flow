import { Box, type BoxProps } from "@chakra-ui/react";
import { motion, type MotionProps } from "framer-motion";

export type MotionBoxProps = BoxProps & MotionProps;

const MotionBoxBase = motion.create(Box);

export function MotionBox(props: MotionBoxProps) {
  return <MotionBoxBase {...props} />;
}
