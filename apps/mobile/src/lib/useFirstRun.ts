import { useLocalStorage } from "lib/useLocalStorage";

export const useFirstRun = () => {
  const [firstRun, setFirstRun] = useLocalStorage("firstRun", {
    didShowReportSummary: false,
  });

  return [firstRun, setFirstRun] as const;
};
