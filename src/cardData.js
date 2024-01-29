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
      score: 0,
      reason: "",
      value: []
    }
  }
}

export default ratedCardData;
