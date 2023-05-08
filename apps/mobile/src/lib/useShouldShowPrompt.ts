import { useState } from 'react';
import { differenceInDays } from "date-fns";


const getInstallPromptLastSeenAt = (promptName: string): any => localStorage.getItem(promptName);

const setInstallPromptSeenToday = (promptName: string): void => {
  const today = new Date().toISOString();
  localStorage.setItem(promptName, today);
};

function getUserShouldBePromptedToInstall(promptName: string, daysToWaitBeforePromptingAgain: number): boolean {
  const lastPrompt = new Date(getInstallPromptLastSeenAt(promptName));
  const daysSinceLastPrompt = differenceInDays(new Date(),lastPrompt);
  return isNaN(daysSinceLastPrompt) || daysSinceLastPrompt > daysToWaitBeforePromptingAgain;
}

const useShouldShowPrompt = (promptName: string, daysToWaitBeforePromptingAgain = 1): [boolean, () => void] => {
  const [userShouldBePromptedToInstall, setUserShouldBePromptedToInstall] = useState(
    getUserShouldBePromptedToInstall(promptName, daysToWaitBeforePromptingAgain)
  );

  const handleUserSeeingInstallPrompt = () => {
    setUserShouldBePromptedToInstall(false);
    setInstallPromptSeenToday(promptName);
  };

  return [userShouldBePromptedToInstall, handleUserSeeingInstallPrompt];
};
export default useShouldShowPrompt;