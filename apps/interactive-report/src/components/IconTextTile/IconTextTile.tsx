import { IconButton } from "components/IconButton";

import "./IconTextTile.css";
import { Input } from "components/Input";

interface IconTextTileProps {
  title: string;
  details?: string;
  icon?: string;
  iconAlt?: string;
  isLoading?: boolean;
  onReorder?: (direction: 1 | -1) => void;
  onDelete?: () => void;
  onUpdate?: () => void;
  link?: string;
  description_line_1?: string;
  description_line_2?: string;
  description_line_3?: string;
  checked?: boolean;
  onCheck?: () => void;
}

export const IconTextTile = ({
  title,
  details,
  link,
  icon,
  iconAlt,
  isLoading,
  onReorder,
  onDelete,
  onUpdate,
  description_line_1,
  description_line_2,
  description_line_3,
  checked = false,
  onCheck,
}: IconTextTileProps) => {
  return (
    <div className="IconTextTile">
      {onReorder ? (
        <div className="IconTextTile__ButtonContainer">
          <IconButton
            icon="/img/chevron-up.svg"
            alt="Move item up"
            disabled={isLoading}
            onClick={() => onReorder(-1)}
          />
          <IconButton
            icon="/img/chevron-down.svg"
            alt="Move item down"
            disabled={isLoading}
            onClick={() => onReorder(1)}
          />
        </div>
      ) : null}

      {onCheck ? (
        <div className="IconTextTile__ButtonContainer">
          <Input
            type="checkbox"
            onChange={onCheck}
            disabled={isLoading}
            checked={checked}
            className="customCheckbox"
          />
        </div>
      ) : null}

      <div className="Utils__Tile IconTextTile__Tile">
        {icon ? (
          <img src={icon} alt={iconAlt} className="IconTextTile__Tile__Icon" />
        ) : null}
        <div className="IconTextTile__Tile__TextContent">
          <div className="IconTextTile__Tile__TextContent__Title">{title}</div>
          <div className="IconTextTile__Tile__TextContent__Details">
            {details}
          </div>
          {description_line_1 && (
            <div className="IconTextTile__Tile__TextContent__Details">
              {description_line_1}
            </div>
          )}
          {description_line_2 && (
            <div className="IconTextTile__Tile__TextContent__Details">
              {description_line_2}
            </div>
          )}
          {description_line_3 && (
            <div className="IconTextTile__Tile__TextContent__Details">
              {description_line_3}
            </div>
          )}
          {link ? (
            <div className="IconTextTile__Tile__TextContent__Details">
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="IconTextTile__Tile__TextContent__Details"
              >
                Click Here
              </a>
            </div>
          ) : null}
        </div>
      </div>

      {onDelete ? (
        <div className="IconTextTile__ButtonContainer">
          <IconButton
            icon="/img/trash.svg"
            alt="Delete item"
            disabled={isLoading}
            onClick={onDelete}
          />
        </div>
      ) : null}
      {onUpdate ? (
        <div className="IconTextTile__ButtonContainer">
          <IconButton
            icon="/img/edit.svg"
            alt="Update item"
            disabled={isLoading}
            onClick={onUpdate}
          />
        </div>
      ) : null}
    </div>
  );
};
