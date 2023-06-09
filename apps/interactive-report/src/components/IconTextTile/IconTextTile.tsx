import { IconButton } from "components/IconButton";

import "./IconTextTile.css";

interface IconTextTileProps {
  title: string;
  details?: string;
  icon?: string;
  iconAlt?: string;
  isLoading?: boolean;
  onReorder?: (direction: 1 | -1) => void;
  onDelete?: () => void;
}

export const IconTextTile = ({
  title,
  details,
  icon,
  iconAlt,
  isLoading,
  onReorder,
  onDelete,
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

      <div className="Utils__Tile IconTextTile__Tile">
        {icon ? (
          <img src={icon} alt={iconAlt} className="IconTextTile__Tile__Icon" />
        ) : null}
        <div className="IconTextTile__Tile__TextContent">
          <div className="IconTextTile__Tile__TextContent__Title">{title}</div>
          <div className="IconTextTile__Tile__TextContent__Details">
            {details}
          </div>
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
    </div>
  );
};
