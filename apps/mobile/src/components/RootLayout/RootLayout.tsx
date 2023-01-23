import { Link, Outlet } from "react-router-dom";

import logo from "static/img/logo.svg";

export const RootLayout = () => {
  return (
    <>
      <header>
        <Link to="/">
          <img
            src={logo}
            alt="Loop Health logo, the word 'loop' written in loopy, curly handwriting using green ink"
          />
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};
