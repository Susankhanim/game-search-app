import heartIcon from "../assets/heart.svg";
import cartIcon from "../assets/card.svg";
import ltFlag from "../assets/lt.png";

export default function UserMenu() {
  return (
    <div className="right">
      <div className="lang">
        <img className="flagImg" src={ltFlag} alt="Lithuania" />
        <span>English EU | EUR</span>
      </div>

      <button className="miniBtn" aria-label="Favorites" type="button">
        <img className="miniIcon" src={heartIcon} alt="" aria-hidden="true" />
      </button>

      <button className="miniBtn" aria-label="Cart" type="button">
        <img className="miniIcon" src={cartIcon} alt="" aria-hidden="true" />
      </button>

      <div className="avatar">A</div>
    </div>
  );
}
