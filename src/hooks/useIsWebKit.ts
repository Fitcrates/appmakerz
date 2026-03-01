import { useEffect, useState } from 'react';

export const useIsWebKit = (): boolean | null => {
  const [isWebKit, setIsWebKit] = useState<boolean | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isSafari = /safari/i.test(ua) && !/chrome|chromium|edg|opr/i.test(ua);
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    setIsWebKit(isSafari || isIOS);
  }, []);

  return isWebKit;
};
