import type { CSSProperties } from 'react';
import styles from '@/components/project/TechBadge.module.css';
import { resolveTechIcon, techIconUrl, techMonogram } from '@/components/project/techIcons';

type BadgeSize = 'sm' | 'md';
type BadgeTone = 'hover' | 'always';

interface TechBadgeProps {
  name: string;
  size?: BadgeSize;
  tone?: BadgeTone;
}

/**
 * A single technology tile: brand icon in its own cell, name next to it.
 * Unmapped technologies fall back to a monogram, so the row never breaks.
 */
export function TechBadge({ name, size = 'md', tone = 'hover' }: TechBadgeProps) {
  const icon = resolveTechIcon(name);
  const style = icon ? ({ '--tech-color': icon.color } as CSSProperties) : undefined;
  const className = [styles.badge, styles[size], tone === 'always' ? styles.toneAlways : '']
    .filter(Boolean)
    .join(' ');

  return (
    <span className={className} style={style}>
      <span className={styles.iconCell}>
        {icon ? (
          <span
            className={styles.icon}
            style={{
              maskImage: `url(${techIconUrl(icon.slug)})`,
              WebkitMaskImage: `url(${techIconUrl(icon.slug)})`,
            }}
            aria-hidden="true"
          />
        ) : (
          <span className={styles.monogram} aria-hidden="true">
            {techMonogram(name)}
          </span>
        )}
      </span>
      <span className={styles.label}>{name}</span>
    </span>
  );
}

interface TechBadgeListProps {
  items: string[];
  size?: BadgeSize;
  tone?: BadgeTone;
  /** Cap the visible badges; the remainder collapses into a counter. */
  max?: number;
  /** Where the counter links to - typically the full tech stack section. */
  moreHref?: string;
  moreLabel?: (count: number) => string;
  className?: string;
}

export function TechBadgeList({
  items,
  size = 'md',
  tone = 'hover',
  max,
  moreHref,
  moreLabel,
  className,
}: TechBadgeListProps) {
  const list = items.filter(Boolean);

  if (!list.length) {
    return null;
  }

  const visible = max && list.length > max ? list.slice(0, max) : list;
  const hidden = list.length - visible.length;
  const moreText = moreLabel ? moreLabel(hidden) : `+${hidden}`;
  const moreClassName = [styles.more, styles[size]].join(' ');

  return (
    <div className={[styles.list, className].filter(Boolean).join(' ')}>
      {visible.map((item) => (
        <TechBadge key={item} name={item} size={size} tone={tone} />
      ))}

      {hidden > 0 ? (
        moreHref ? (
          <a href={moreHref} className={moreClassName} title={list.slice(visible.length).join(', ')}>
            <span className={styles.label}>{moreText}</span>
          </a>
        ) : (
          <span className={moreClassName} title={list.slice(visible.length).join(', ')}>
            <span className={styles.label}>{moreText}</span>
          </span>
        )
      ) : null}
    </div>
  );
}

export default TechBadge;
