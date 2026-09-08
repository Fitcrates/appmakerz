import type { Language } from '@/lib/language';

interface ServiceStat {
  value: string;
  label: string;
}

interface ServiceStatsNewProps {
  stats: ServiceStat[];
  language: Language;
}

// Lifted out of uslugi/[slug]/page.tsx so the hub layout renders the same band
// from the same source instead of a second copy that drifts.
export default function ServiceStatsNew({ stats }: ServiceStatsNewProps) {
  if (!stats.length) {
    return null;
  }

  return (
    <section className="border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border-x border-white/10">
          {stats.map((stat, index) => (
            <div key={`stat-${index}`} className="bg-indigo-950 py-8 lg:py-10 px-6">
              <p className="text-3xl sm:text-4xl font-light font-oxanium text-teal-300 notranslate">
                {stat.value}
              </p>
              <p className="text-white/50 text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
