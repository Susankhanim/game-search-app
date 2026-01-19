import searchIcon from "../assets/search.svg";
import SearchHistory from "./SearchHistory";

export default function SearchBar({
  search,
  onSearchChange,
  onSearchFocus,
  onSearchKeyDown,
  isHistOpen,
  filteredHistory,
  onSelectHistory,
  onClearHistory,
  searchWrapRef,
}) {
  return (
    <div className="searchWrap" ref={searchWrapRef}>
      <img className="iconImg" src={searchIcon} alt="" aria-hidden="true" />

      <input
        className="search"
        value={search}
        onChange={onSearchChange}
        onFocus={onSearchFocus}
        onKeyDown={onSearchKeyDown}
        placeholder="Search"
        autoComplete="off"
        spellCheck={false}
      />

      {search ? (
        <button
          className="clear"
          onClick={() => onSearchChange({ target: { value: "" } })}
          aria-label="Clear"
          type="button"
        >
          ✕
        </button>
      ) : null}

      <SearchHistory
        isOpen={isHistOpen}
        filteredHistory={filteredHistory}
        onSelectHistory={onSelectHistory}
        onClearHistory={onClearHistory}
      />
    </div>
  );
}
