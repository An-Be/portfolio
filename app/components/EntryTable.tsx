import Link from "next/link";

export type EntryRow = {
  id: string;
  title: string;
  summary: string;
  focus: string;
  dotColor: string;
  dotFilled: boolean;
};

export default function EntryTable({
  items,
  hrefBase,
}: {
  items: EntryRow[];
  hrefBase: string;
}) {
  return (
    <div className="entry-table">
      <div className="entry-row entry-row-head" aria-hidden>
        <span className="entry-col-status t-label">Status</span>
        <span className="t-label">Project</span>
        <span className="entry-col-focus t-label">Focus</span>
        <span />
      </div>
      {items.map((item) => (
        <Link key={item.id} href={`${hrefBase}${item.id}`} className="entry-row">
          <span className="entry-col-status">
            <span
              className="entry-dot"
              style={
                item.dotFilled
                  ? { background: item.dotColor, borderColor: item.dotColor }
                  : { background: "transparent", borderColor: item.dotColor }
              }
            />
          </span>
          <span className="entry-col-title">
            <span className="entry-title-text">{item.title}</span>
            <span className="entry-summary-text">{item.summary}</span>
          </span>
          <span className="entry-col-focus t-caption">{item.focus}</span>
          <span className="entry-row-arrow" aria-hidden>
            →
          </span>
        </Link>
      ))}
    </div>
  );
}
