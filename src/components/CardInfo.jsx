import { useCheckup } from "../checkup";
import { getCardIconUrl } from "../iconutil";
import cardData from "../data/cardData";

export function CardInfo({ card, cardInfoRef, style }) {
  const {hasCard, inventory} = useCheckup();
  return (
    <div className="card-info" ref={cardInfoRef} style={style}>
      <strong>{inventory === undefined && "匯入背包後，將"}因以下卡片而改變分數</strong><hr/>
      {(cardData[card]?.value ?? []).map(([value, quantity], i) => (
        <span className="float-score__card" key={value}>
          <img
            src={getCardIconUrl(value)}
            alt={value}
            className={`float-score__card-icon ${!(hasCard(value) || inventory === undefined) && "float-score__card-icon--disabled"}`}
          />
          <span className={`float-score__variation ${hasCard(value) ? "float-score__variation--enabled" : inventory !== undefined && "float-score__variation--disabled"}`}>{quantity >= 0 ? `+${quantity}` : quantity}</span>
        </span>
      ))}
    </div>
  );
}
