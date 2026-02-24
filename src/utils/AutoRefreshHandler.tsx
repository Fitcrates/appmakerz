import { useEffect, useState, useRef } from 'react';

const AutoRefreshHandler = () => {
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());
  const loadAttempts = useRef(0); 

  useEffect(() => {
    const checkInitialLoad = () => {
      if (document.readyState === 'complete') {
        const criticalScripts = Array.from(document.scripts)
          .filter(script => script.src.includes('App-') || script.src.includes('index-'));

        const hasLoadError = criticalScripts.some(script => !script.loaded);

        if (hasLoadError && loadAttempts.current < 3) {
          loadAttempts.current += 1;
          window.location.reload();
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndRefresh();
      }
    };

    const handleFocus = () => {
      checkAndRefresh();
    };

    const checkAndRefresh = () => {
      const currentTime = Date.now();
      const timeDifference = currentTime - lastActiveTime;

      if (timeDifference > 6 * 60 * 60 * 1000) {
        window.location.reload();
      }

      setLastActiveTime(currentTime);
    };

    window.addEventListener('load', checkInitialLoad);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('load', checkInitialLoad);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [lastActiveTime]); 
  return null;
};

export default AutoRefreshHandler;
