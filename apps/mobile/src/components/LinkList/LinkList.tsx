import { ReactNode } from "react";

import "./LinkList.css";

import { ReactComponent as DefaultIcon } from "images/xray.svg";

interface LinkListLink {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
}

interface LinkListProps {
  links: LinkListLink[];
}

export const LinkList = ({ links }: LinkListProps) => {
  return (
    <ul className="LinkList">
      {links.map(({ href, title, description, icon }, index: number) => (
        <li key={index} className="LinkList__Item">
          <a href={href} className="LinkList__Item__Link">
            <div className="LinkList__Item__Link__Icon">
              {icon || <DefaultIcon />}
            </div>
            <div className="LinkList__Item__Link__Info">
              <h3 className="LinkList__Item__Link__Info__Title">{title}</h3>
              <p className="LinkList__Item__Link__Info__Description">
                {description}
              </p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
};
