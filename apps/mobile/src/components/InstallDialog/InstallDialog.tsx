import useIosInstallPrompt from "lib/useIosInstallPrompt";
import "./InstallDialog.css";
import useWebInstallPrompt from "lib/useWebInstallPrompt";
import { Button, ButtonVariant } from "components/Button";
import { useEffect } from "react";

export const InstallPWADialog = ({ setIsOpen }: any) => {
  const [iosInstallPrompt] = useIosInstallPrompt();
  const [webInstallPrompt, handleWebInstallDeclined, handleWebInstallAccepted] =
    useWebInstallPrompt();

  useEffect(() => {
    const installAppBtn = document.getElementById("installApp");

    installAppBtn?.addEventListener("click", () => {
      handleWebInstallAccepted();
      setIsOpen(false);
    });

    return () => {
      installAppBtn?.removeEventListener("click", () => {
        handleWebInstallAccepted();
        setIsOpen(false);
      });
    };
    // eslint-disable-next-line
  }, [webInstallPrompt]);

  if (!iosInstallPrompt && !webInstallPrompt) {
    return null;
  }

  return (
    <>
      <div
        className="darkBG"
        onClick={() => {
          setIsOpen(false);
        }}
      />
      <div className="centered">
        <div
          className="modal"
          style={iosInstallPrompt ? { height: "200px" } : {}}
        >
          <div className="modalHeader">
            <h5 className="heading">Install App</h5>
          </div>
          {iosInstallPrompt && (
            <>
              <div className="modalContentContainer">
                <div className="modalContent">
                  Tap
                  <img
                    src="./img/share.svg"
                    style={{ margin: "auto 8px" }}
                    className=""
                    alt="Add to homescreen"
                    width="20"
                  />
                  then &quot;Add to Home Screen&quot;.
                </div>
                <div className="modalContent">Login after installing.</div>
              </div>
              <div className="modalActions">
                <div className="actionsContainer">
                  <Button
                    className="HomeRoute__Logout__Button"
                    variant={ButtonVariant.Primary}
                    onClick={() => {
                      //   handleIOSInstallDeclined();
                      setIsOpen(false);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
          {webInstallPrompt && (
            <>
              <div className="modalContentContainer">
                <div className="modalContent">
                  Please install Loop Health Care application.
                </div>
              </div>
              <div className="modalActions">
                <div className="actionsContainer">
                  <Button
                    className="HomeRoute__Logout__Button"
                    variant={ButtonVariant.Danger}
                    onClick={() => {
                      handleWebInstallDeclined();
                      setIsOpen(false);
                    }}
                  >
                   Not Now
                  </Button>
                  <Button
                    id="installApp"
                    className="HomeRoute__Logout__Button"
                    variant={ButtonVariant.Primary}
                  >
                    Install
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
