import "./PageHeader.css";

interface PageHeaderProps {
  label: string;
}

export const PageHeader = ({ label }: PageHeaderProps) => {
  return <div className="PageHeader">{label}</div>;
};
