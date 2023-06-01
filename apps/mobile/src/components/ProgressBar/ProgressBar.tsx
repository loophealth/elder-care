import "./ProgressBar.css";
interface ProgressBarProps {
  bgcolor: string;
  completed: number;
}

export const ProgressBar = (props: ProgressBarProps) => {
  const { bgcolor, completed } = props;
  return (
    <div className="containerStyles">
      <div
        className="fillerStyles"
        style={{ width: `${completed}%`, backgroundColor: bgcolor }}
      >
      </div>
    </div>
  );
};
