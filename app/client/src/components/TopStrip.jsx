import topLogoPng from "../assets/toplogo.png";

export default function TopStrip() {
  return (
    <div className="topStrip">
      <div className="topStripInner">
        <img className="topLogo" src={topLogoPng} alt="Eneba" />
        <span className="topText">Games, Gift Cards, Top-Ups & More | Best Deals</span>
      </div>
    </div>
  );
}
