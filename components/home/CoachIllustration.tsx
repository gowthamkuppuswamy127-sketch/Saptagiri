/**
 * Side profile of a coach, drawn to match the operator's own livery: white
 * body, blue band, marigold stripe along the skirt.
 */
export function CoachIllustration({
  className = '',
  windows = 7,
  sleeper = false,
}: {
  className?: string;
  windows?: number;
  sleeper?: boolean;
}) {
  const windowWidth = 20;
  const gap = 4;
  const startX = 30;

  return (
    <svg viewBox="0 0 260 90" className={className} role="presentation" aria-hidden="true">
      {/* body */}
      <rect x="8" y="12" width="244" height="56" rx="10" className="fill-white stroke-brand-200" strokeWidth="1.5" />

      {/* windscreen */}
      <path d="M12 26 Q12 18 20 18 L28 18 L28 44 L12 44 Z" className="fill-brand-100" />

      {/* passenger windows */}
      {Array.from({ length: windows }).map((_, i) => (
        <rect
          key={i}
          x={startX + i * (windowWidth + gap)}
          y={sleeper ? 20 : 22}
          width={windowWidth}
          height={sleeper ? 14 : 18}
          rx="2.5"
          className="fill-brand-100"
        />
      ))}

      {/* upper berth windows only exist on the sleeper */}
      {sleeper &&
        Array.from({ length: windows }).map((_, i) => (
          <rect
            key={`u${i}`}
            x={startX + i * (windowWidth + gap)}
            y={38}
            width={windowWidth}
            height={11}
            rx="2"
            className="fill-brand-50"
          />
        ))}

      {/* blue band and gold skirt stripe */}
      <rect x="8" y="54" width="244" height="6" className="fill-brand-700" />
      <rect x="8" y="60" width="244" height="3" className="fill-gold-500" />

      {/* destination board */}
      <rect x="34" y="15" width="52" height="1.5" rx="0.75" className="fill-brand-700" />

      {/* wheels */}
      <circle cx="58" cy="70" r="10" className="fill-brand-900" />
      <circle cx="58" cy="70" r="4" className="fill-brand-200" />
      <circle cx="204" cy="70" r="10" className="fill-brand-900" />
      <circle cx="204" cy="70" r="4" className="fill-brand-200" />

      {/* road */}
      <line x1="0" y1="80" x2="260" y2="80" className="stroke-line" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
