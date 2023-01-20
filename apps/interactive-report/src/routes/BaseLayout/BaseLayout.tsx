import { Outlet } from "react-router-dom";

import "./BaseLayout.css";

export const BaseLayout = () => {
  return (
    <div className="BaseLayout">
      <Outlet />
    </div>
  );
};
