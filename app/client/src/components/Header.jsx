import enebaPng from "../assets/eneba.png";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

export default function Header({
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
    <header className="header">
      <div className="logo">
        <img className="logoIcon" src={enebaPng} alt="Eneba" />
      </div>

      <SearchBar
        search={search}
        onSearchChange={onSearchChange}
        onSearchFocus={onSearchFocus}
        onSearchKeyDown={onSearchKeyDown}
        isHistOpen={isHistOpen}
        filteredHistory={filteredHistory}
        onSelectHistory={onSelectHistory}
        onClearHistory={onClearHistory}
        searchWrapRef={searchWrapRef}
      />

      <UserMenu />
    </header>
  );
}
