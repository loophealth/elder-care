import "./TimelineList.css";

export interface TimelineListItem {
  label: string;
  when: "past" | "present" | "future";
}

const ITEM_IMAGES = {
  past: "/img/diamond-yellow.svg",
  present: "/img/diamond-orange.svg",
  future: "/img/diamond-gray.svg",
};

export const TimelineList = ({ items }: { items: TimelineListItem[] }) => {
  return (
    <div className="TimelineList">
      {items.map((item) => {
        return (
          <div className="TimelineList__Item" key={item.label}>
            <img
              className="TimelineList__Item__When"
              src={ITEM_IMAGES[item.when]}
              alt=""
            />
            <div className="TimelineList__Item__Label">{item.label}</div>
          </div>
        );
      })}
      <div className="TimelineList__Ticks" />
    </div>
  );
};
