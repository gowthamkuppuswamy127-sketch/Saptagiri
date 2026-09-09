'use client';

import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { formatINR } from '@/lib/booking/fare';

/**
 * The primary action on every booking step. Fixed to the bottom on phones —
 * where it clears the home indicator — and inline within the page on desktop.
 */
export function StickyBar({
  primaryLabel,
  hint,
  total,
  disabled = false,
  busy = false,
  onPrimary,
}: {
  primaryLabel: string;
  hint?: string;
  total?: number;
  disabled?: boolean;
  busy?: boolean;
  onPrimary: () => void;
}) {
  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 30 }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/97 shadow-float backdrop-blur-md"
    >
      <div className="container-page safe-bottom flex items-center gap-4 pt-3">
        <div className="min-w-0 flex-1">
          {total !== undefined && total > 0 && (
            <p className="font-display text-xl font-semibold tnum leading-tight text-brand-900">
              {formatINR(total)}
            </p>
          )}
          {hint && <p className="truncate text-xs text-muted">{hint}</p>}
        </div>

        <button
          type="button"
          onClick={onPrimary}
          disabled={disabled || busy}
          className="flex min-h-[52px] shrink-0 items-center gap-2 rounded-sm bg-brand-700 px-6 font-semibold text-white transition-all hover:bg-brand-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-faint disabled:active:scale-100"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {primaryLabel}
        </button>
      </div>
    </motion.div>
  );
}
