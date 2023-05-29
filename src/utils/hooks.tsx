import { useEffect, useRef } from 'react';

export function useDidUpdateEffect(effect: () => void, deps: any) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
    } else {
      return effect();
    }
  }, deps);
}
