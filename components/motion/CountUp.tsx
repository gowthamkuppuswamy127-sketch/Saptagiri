'use client';

import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

/** Counts up once, when scrolled into view. Static under reduced motion. */
export function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduced = useReducedMotion();
  // Always starts at zero so the server and client render the same markup;
  // reduced-motion visitors simply jump straight to the value.
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (reduced) {
      setValue(to);
      return;
    }

    const controls = animate(0, to, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, to]);

  return (
    <span ref={ref} className="tnum">
      {value}
      {suffix}
    </span>
  );
}
