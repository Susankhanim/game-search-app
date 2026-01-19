import GameCard from "./GameCard";

export default function GameGrid({ items }) {
  return (
    <div className="grid">
      {items.map((it) => (
        <GameCard key={it.id} item={it} />
      ))}
    </div>
  );
}
