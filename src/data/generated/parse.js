// IMPORTANT:
// Do NOT import this file

const fs = require("fs");

// monsters.json
// 位於遊戲設定檔中
// [0]: 卡片ID
// [3]: 卡片種族
// [4]: 卡片屬性
// [5]: 卡片星數
// [51]: 異力轉換目標
// [72]: 出售精魄數量類別
// [76]: 卡片種類
const monsters = JSON.parse(fs.readFileSync("monsters.json").toString()).data;
// monsterEvolve.json
// 位於遊戲設定檔中
// [0]: 原卡片ID
// [1]: 進化後卡片ID
const monsterEvolve = JSON.parse(fs.readFileSync("monsterEvolve.json").toString()).data;
// locale.monster.zh.json
// 原始檔案在Asset Bundle中，需要事先轉檔成JSON
// 卡片名稱的key是MONSTER_%d
const translationZh = JSON.parse(fs.readFileSync("locale.monster.zh.json"));

const relations = new Map();
function createRelation(a, b) {
  // relation(a, b)
  // 表示b可以進化或轉換成a
  // 因為十一封王、侵蝕二封王等案例，需要用map of set儲存
  if(relations.has(a)) {
    relations.get(a).add(b);
  }
  else {
    relations.set(a, new Set([b]));
  }
}
// 建立進化的連結
monsterEvolve.forEach(entry => {
  const evolveRule = entry.split("|");

  const baseCardId = parseInt(evolveRule[0]);
  const resultCardId = parseInt(evolveRule[1]);
  createRelation(resultCardId, baseCardId);
});
// 建立異力轉換的連結
monsters.forEach(entry => {
  const cardRule = entry.split("|");

  const entryType = cardRule[76];
  if(entryType !== "monster") return;

  const cardId = parseInt(cardRule[0]);
  const switchCardId = parseInt(cardRule[51]);
  if(!isNaN(switchCardId)) {
    // 另一個方向的連結理論上也記錄在表上
    createRelation(cardId, switchCardId);
  }
});

function buildEqSet(eqSet, cardId) {
  // 找出所有進化來源、轉換來源
  // 因為彈珠妮奧、異力轉換等案例，需要避免卡在cycle中
  if(eqSet.has(cardId)) return eqSet;

  eqSet.add(cardId);
  if(relations.has(cardId)) {
    relations.get(cardId).forEach(item => {
      buildEqSet(eqSet, item);
    });
  }

  return eqSet;
}
const allMaxData = {};
monsters.forEach(entry => {
  const cardRule = entry.split("|");

  const entryType = cardRule[76];
  if(entryType !== "monster") return;

  const cardId = parseInt(cardRule[0]);
  const cardRace = parseInt(cardRule[3]);
  const cardAttr = parseInt(cardRule[4]);
  const cardRarity = parseInt(cardRule[5]);
  const cardALMaterial = parseInt(cardRule[72]);

  const eqSet = buildEqSet(new Set(), cardId);
  eqSet.delete(cardId);

  allMaxData[cardId] = {
    name: translationZh[`MONSTER_${cardId}`]?.replaceAll(/\s?[‧·]\s?/g, "・") ?? "",
    attribute: cardAttr,
    race: cardRace,
    rarity: cardRarity,
    materialLevel2: cardALMaterial === 2 || undefined,  // Level 2 = 90精魄
    equivalences: [...eqSet]
  };
});

fs.writeFileSync("cardData.json", JSON.stringify(allMaxData, null, 2));
