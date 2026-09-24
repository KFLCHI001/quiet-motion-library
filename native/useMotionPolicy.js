// Reduce Motion + app lifecycle in one hook. Requires react-native-reanimated 3+.
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { motionPolicy } from './motion-policy.js';

export function useMotionPolicy({ quiet = false } = {}) {
  const reduceMotion = useReducedMotion();
  const [appState, setAppState] = useState(AppState.currentState ?? 'active');
  useEffect(() => {
    const subscription = AppState.addEventListener('change', setAppState);
    return () => subscription.remove();
  }, []);
  return motionPolicy({ reduceMotion, appState, quiet });
}
