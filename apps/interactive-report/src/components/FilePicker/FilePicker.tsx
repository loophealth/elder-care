import { Button } from "components/Button";
import { ComponentPropsWithoutRef, useRef } from "react";

import "./FilePicker.css";

interface FilePickerProps extends ComponentPropsWithoutRef<"button"> {
  label?: string;
  onPick: (file: File) => void;
  isPrimary?: boolean;
}

export const FilePicker = ({
  label,
  onPick,
  isPrimary,
  ...restProps
}: FilePickerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onTriggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onChangeFileInput = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      onPick(file);
    }
  };

  return (
    <div className="FilePicker">
      <Button
        onClick={onTriggerFilePicker}
        isPrimary={isPrimary}
        {...restProps}
      >
        {label || "Open file …"}
      </Button>
      <input type="file" ref={fileInputRef} onChange={onChangeFileInput} />
    </div>
  );
};
