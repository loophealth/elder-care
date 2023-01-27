import { useEffect, useState } from "react";
import { SafeArea } from "capacitor-plugin-safe-area";

interface Dimensions {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const useSafeArea = () => {
  const [isLoadingSafeAreaInsets, setIsLoadingSafeAreaInsets] = useState(true);
  const [safeAreaInsets, setSafeAreaInsets] = useState<Dimensions | null>(null);

  useEffect(() => {
    const loadSafeAreaInsets = async () => {
      setIsLoadingSafeAreaInsets(true);
      const { insets } = await SafeArea.getSafeAreaInsets();
      setSafeAreaInsets(insets);
      setIsLoadingSafeAreaInsets(false);
    };

    loadSafeAreaInsets();
  }, []);

  return { isLoadingSafeAreaInsets, safeAreaInsets };
};
