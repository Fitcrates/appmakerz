'use client';

import { useEffect, useState } from 'react';
import ElectricLogo from '@/components/next/ElectricLogo';
import ElectricLogoMobile from '@/components/next/ElectricLogoMobile';

interface ResponsiveElectricLogoProps {
  src: string;
  alt: string;
  desktopClassName?: string;
  mobileClassName?: string;
}

export default function ResponsiveElectricLogo({
  src,
  alt,
  desktopClassName = '',
  mobileClassName = '',
}: ResponsiveElectricLogoProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const updateLayout = () => setIsMobile(mediaQuery.matches);

    updateLayout();
    mediaQuery.addEventListener('change', updateLayout);

    return () => mediaQuery.removeEventListener('change', updateLayout);
  }, []);

  return isMobile ? (
    <ElectricLogoMobile src={src} alt={alt} className={mobileClassName} />
  ) : (
    <ElectricLogo src={src} alt={alt} className={desktopClassName} />
  );
}
