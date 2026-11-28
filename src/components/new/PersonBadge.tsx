import Image from 'next/image';
import SpotlightText from '@/components/new/SpotlightText';

// A small signature line: a thumbnail of the one portrait on the site (the
// about-me hero in Sanity) next to the name, in the size of the avatar rows
// sites use for social proof. Deliberately a single face: there is one person
// behind AppCrates, so no stack of avatars and no headcount.
const PORTRAIT =
  'https://cdn.sanity.io/images/867nk643/production/9b2d68bbc993e18a32ad5b3ff0de2cf91c5e373b-1143x2048.webp?rect=0,190,1143,1143';

interface PersonBadgeProps {
  line: string;
  align?: 'start' | 'center';
}

export default function PersonBadge({ line, align = 'start' }: PersonBadgeProps) {
  return (
    <div className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
      <Image
        src={PORTRAIT}
        alt="Arkadiusz Wawrzyniak"
        width={32}
        height={32}
        sizes="32px"
        className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-indigo-950 outline outline-1 outline-white/20"
      />
      <SpotlightText className="font-plex text-sm leading-snug text-white/60!" glowSize={100}>
        {[<span key="name" className="text-white/90">Arkadiusz Wawrzyniak</span>, ` · ${line}`]}
      </SpotlightText>
    </div>
  );
}
