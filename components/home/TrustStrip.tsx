import { CountUp } from '@/components/motion/CountUp';
import { operator } from '@/data/operator';

export function TrustStrip() {
  return (
    <section className="border-y border-line bg-surface-2" aria-label="Sapthagiri Travels at a glance">
      <div className="container-page grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4 md:py-12">
        {operator.stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-display text-3xl font-semibold text-brand-700 md:text-4xl">
              <CountUp to={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-1 text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
