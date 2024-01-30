import cardData from "./data/cardData.json";
import cardRate from "./data/rate.json";

const ratedCardData = {};
for(const key in cardData) {
  if(key in cardRate) {
    ratedCardData[key] = {
      ...cardRate[key],
      ...cardData[key]
    };
  }
  else {
    ratedCardData[key] = {
      ...cardData[key],
      // 原則上不需要這些多餘的資料
      // 出任何問題的話，請先去檢查哪裡該加 ?? 或 ?.
      /*
      score: 0,
      reason: "",
      value: []
      */
    }
  }
}

export default ratedCardData;
