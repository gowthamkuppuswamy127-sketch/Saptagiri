'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { operator } from '@/data/operator';

/**
 * Decides whether this visitor should get the video at all.
 *
 * A 16 MB autoplaying background is the fastest way to ruin a phone's data
 * plan, so: reduced-motion and data-saver visitors keep the poster, phones get
 * the 720p cut, and everyone else gets 1280p — and only after the page has
 * settled, so the video never competes with the first paint.
 */
function useHeroVideo() {
  const reduced = useReducedMotion();
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (reduced) return;

    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;

    if (connection?.saveData) return;
    if (connection?.effectiveType && /^(slow-)?2g$|^3g$/.test(connection.effectiveType)) return;

    const choose = () =>
      setSrc(window.innerWidth < 768 ? '/media/hero-720.mp4' : '/media/hero-1280.mp4');

    // Wait for idle so the video never delays the largest contentful paint.
    const idle = window.requestIdleCallback?.(choose, { timeout: 1800 }) ?? window.setTimeout(choose, 900);

    return () => {
      if (window.cancelIdleCallback && typeof idle === 'number') window.cancelIdleCallback(idle);
      window.clearTimeout(idle as number);
    };
  }, [reduced]);

  return src;
}

export function Hero() {
  const src = useHeroVideo();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (src && videoRef.current) videoRef.current.load();
  }, [src]);

  const words = operator.tagline.split(' ');

  return (
    <section className="relative isolate flex min-h-[78dvh] flex-col justify-end overflow-hidden bg-black md:min-h-[86dvh]">
      {/* Poster paints immediately; the video fades over it once it can play. */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: 'url(/media/hero-poster.webp)' }}
        role="img"
        aria-label="A Sapthagiri coach on a misty ghat road in the Western Ghats"
      />

      {src && (
        <video
          ref={videoRef}
          className={`absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-1000 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          poster="/media/hero-poster.webp"
          preload="none"
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setLoaded(true)}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* Keeps the tagline legible over whatever frame is showing. Neutral black
          rather than brand navy, and clear at the top, so the footage keeps its
          own colour instead of picking up a blue cast. */}
      <div className="absolute inset-0 -z-[5] bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="container-page relative pb-16 pt-28 md:pb-24 md:pt-40">
        <h1 className="max-w-3xl font-display text-[clamp(2.25rem,7vw,4.5rem)] font-semibold leading-[1.05] text-white">
          {words.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  className="inline-block"
                  initial={{ opacity: 0, y: '0.4em' }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}
                  {i < words.length - 1 && ' '}
                </motion.span>
              ))}
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-10 flex items-center gap-2 text-sm text-white/70 md:mt-14"
        >
          <ChevronDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
          <span>Search buses below</span>
        </motion.div>
      </div>
    </section>
  );
}
