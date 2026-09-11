"use client";

import { motion, type Easing } from "framer-motion";
import type { ReactNode } from "react";

const EASE: Easing = [0.21, 0.47, 0.32, 0.98];

export function Reveal({
  children,
  delay = 0,
  x = 0,
  y = 22,
  duration = 0.7,
  once = true,
  amount = 0.25,
  width = "100%",
}: {
  children: ReactNode;
  delay?: number;
  x?: number;
  y?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  width?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
      style={{ width }}
    >
      {children}
    </motion.div>
  );
}

export function RevealStagger({
  children,
  delay = 0,
  stagger = 0.12,
  once = true,
  amount = 0.2,
}: {
  children: ReactNode;
  delay?: number;
  stagger?: number;
  once?: boolean;
  amount?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export function StaggerItem({ children }: { children: ReactNode }) {
  return <motion.div variants={staggerItem}>{children}</motion.div>;
}

/**
 * Gentle, infinite idle float — for hero mockups / cards that should feel
 * alive without being distracting.
 */
export function Float({
  children,
  range = 10,
  duration = 5,
  delay = 0,
}: {
  children: ReactNode;
  range?: number;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -range, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
