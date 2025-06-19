import { useState, useEffect } from 'react';

export function useBreakpoint(breakpoint = 768) {
  const [isDesktop, setIsDesktop] = useState(
    () => window.innerWidth >= breakpoint
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
    
    const handleResize = (event) => {
      setIsDesktop(event.matches);
    };
    mediaQuery.addEventListener('change', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, [breakpoint]);

  return isDesktop;
}
