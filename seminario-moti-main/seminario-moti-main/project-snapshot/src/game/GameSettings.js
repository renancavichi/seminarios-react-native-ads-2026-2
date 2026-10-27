import { createContext, useContext, useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

const SettingsContext = createContext(null);

export function GameSettingsProvider({ children }) {
  const [demo, setDemo] = useState(false);
  const [slow, setSlow] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [systemReduceMotion, setSystemReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setSystemReduceMotion(value);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setSystemReduceMotion);
    return () => { mounted = false; subscription.remove(); };
  }, []);

  return (
    <SettingsContext.Provider value={{ demo, setDemo, slow, setSlow, reduceMotion, soundEnabled, setSoundEnabled,
      setReduceMotion, motionReduced: reduceMotion || systemReduceMotion, timeScale: slow ? 1.8 : 1 }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useGameSettings() { return useContext(SettingsContext); }
