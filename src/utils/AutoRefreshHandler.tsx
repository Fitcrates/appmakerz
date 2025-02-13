import { useEffect, useState } from 'react';

const AutoRefreshHandler = () => {
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());

  useEffect(() => {
    // Function to handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const currentTime = Date.now();
        const timeDifference = currentTime - lastActiveTime;
        
        // If more than 6 hours have passed (adjust this threshold as needed)
        if (timeDifference > 6 * 60 * 60 * 1000) {
          window.location.reload();
        }
        
        setLastActiveTime(currentTime);
      }
    };

    // Function to handle focus events
    const handleFocus = () => {
      const currentTime = Date.now();
      const timeDifference = currentTime - lastActiveTime;
      
      // If more than 6 hours have passed
      if (timeDifference > 6 * 60 * 60 * 1000) {
        window.location.reload();
      }
      
      setLastActiveTime(currentTime);
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [lastActiveTime]);

  return null; // This component doesn't render anything
};

export default AutoRefreshHandler;