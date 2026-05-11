import * as Network from "expo-network";

import { useEffect, useState } from "react";

export function useNetworkStatus(): { isOffline: boolean; isChecking: boolean } {
  const [isOffline, setIsOffline] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const state = await Network.getNetworkStateAsync();
        if (!cancelled) {
          setIsOffline(state.isInternetReachable === false || state.isConnected === false);
        }
      } finally {
        if (!cancelled) setIsChecking(false);
      }
    }
    run();
    const id = setInterval(run, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return { isOffline, isChecking };
}
