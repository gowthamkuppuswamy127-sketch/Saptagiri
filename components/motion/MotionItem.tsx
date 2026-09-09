'use client';

import { motion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';

/** A single staggered child of RevealGroup. */
export function MotionItem({
  children,
  variants,
  className = '',
}: {
  children: ReactNode;
  variants: Variants;
  className?: string;
}) {
  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}
