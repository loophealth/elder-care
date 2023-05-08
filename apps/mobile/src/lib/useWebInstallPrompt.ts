import { useState, useEffect } from "react";
import useShouldShowPrompt from "./useShouldShowPrompt";

const webInstallPromptedAt = "webInstallPromptedAt";
const useWebInstallPrompt = (): [any, () => void, () => void] => {
  const [installPromptEvent, setInstallPromptEvent] = useState<any>();
  const [userShouldBePromptedToInstall, handleUserSeeingInstallPrompt] =
    useShouldShowPrompt(webInstallPromptedAt);

  useEffect(() => {
    const beforeInstallPromptHandler = (event: any) => {
      event.preventDefault();

      // check if user has already been asked
      if (userShouldBePromptedToInstall) {
        // store the event for later use
        setInstallPromptEvent(event);
      }
    };
    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    window.addEventListener("appinstalled", (event) => {
      console.log("👍", "appinstalled", event);
      // Clear the deferredPrompt so it can be garbage collected
      setInstallPromptEvent(null);
    });
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        beforeInstallPromptHandler
      );
      window.removeEventListener("appinstalled", (event) => {
        console.log("👍", "appinstalled", event);
        // Clear the deferredPrompt so it can be garbage collected
        setInstallPromptEvent(null);
      });
    };
  }, [userShouldBePromptedToInstall]);

  const handleInstallDeclined = () => {
    handleUserSeeingInstallPrompt();
    setInstallPromptEvent(null);
  };

  const handleInstallAccepted = () => {
    // show native prompt
    installPromptEvent.prompt();

    // decide what to do after the user chooses
    installPromptEvent.userChoice.then((choice: any) => {
      // if the user declined, we don't want to show the prompt again
      if (choice.outcome !== "accepted") {
        handleUserSeeingInstallPrompt();
      }
      setInstallPromptEvent(null);
    });
  };
  return [installPromptEvent, handleInstallDeclined, handleInstallAccepted];
};
export default useWebInstallPrompt;
