import searchIcon from "../assets/search.svg";
import clockIcon from "../assets/time.svg";

export default function SearchHistory({
  isOpen,
  filteredHistory,
  onSelectHistory,
  onClearHistory,
}) {
  if (!isOpen || filteredHistory.length === 0) {
    return null;
  }

  return (
    <div className="histDrop">
      {filteredHistory.map((h) => (
        <button
          key={h}
          type="button"
          className="histItem"
          onClick={() => onSelectHistory(h)}
        >
          <img className="histIconImg" src={clockIcon} alt="" aria-hidden="true" />
          <span className="histText">{h}</span>
        </button>
      ))}

      <div className="histFooter">
        <button type="button" className="histClear" onClick={onClearHistory}>
          Clear history
        </button>
      </div>
    </div>
  );
}
