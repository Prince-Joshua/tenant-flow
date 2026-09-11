import { Flex, type FlexProps } from "@chakra-ui/react";
import { motion, type MotionProps } from "framer-motion";

export type MotionFlexProps = FlexProps & MotionProps;

const MotionFlexBase = motion.create(Flex);

export function MotionFlex(props: MotionFlexProps) {
  return <MotionFlexBase {...props} />;
}
