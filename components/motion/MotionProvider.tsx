'use client';

import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Reduced motion is handled here, once, at animation time — never by branching
 * what gets rendered. The server cannot know a visitor's motion preference, so
 * any component that returned different markup for it would fail hydration.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
