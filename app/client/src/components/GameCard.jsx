import clockIcon from "../assets/time.svg";
import heartIcon from "../assets/heart.svg";
import { pickPlatformLogo, coverUrl } from "../utils";

export default function GameCard({ item }) {
  const pLogo = pickPlatformLogo(item.platform);

  return (
    <div className="card" key={item.id}>
      <div className="imgWrap">
        <img className="img" src={coverUrl(item)} alt={item.game_title} />

        <div className="badge">
          <span className="badgeIcon">+</span>
          <span>CASHBACK</span>
        </div>

        <div className="platformBar">
          {pLogo ? (
            <img className="platformLogo" src={pLogo} alt="" aria-hidden="true" />
          ) : null}
          <span className="platformText">{item.platform}</span>
        </div>
      </div>

      <div className="cardBody">
        <div className="cardTitle">{item.game_title}</div>

        <div className="cardRegion">{item.region}</div>

        <div className="cardSub">
          From{" "}
          <span className="oldInline">€{Number(item.old_price || 0).toFixed(2)}</span>{" "}
          <span className="discInline">-{item.discount_percent || 0}%</span>
        </div>

        <div className="cardPriceRow">
          <div className="bigPrice">€{Number(item.price).toFixed(2)}</div>
          <img className="langTimeIcon" src={clockIcon} alt="" aria-hidden="true" />
        </div>

        <div className="cashRow">
          <span className="cashLabel">Cashback:</span>
          <span className="cashValue">€{Number(item.cashback || 0).toFixed(2)}</span>
        </div>

        <div className="likeRow">
          <img className="histIconImg" src={heartIcon} alt="" aria-hidden="true" />
          <span className="likeCount">{item.likes_count ?? 0}</span>
        </div>
      </div>
    </div>
  );
}
