// IMPORTANT:
// Do NOT import this file

const fs = require("fs");

// monsters.json 和 monsterEvolve.json
// 位於遊戲設定檔中
const monsters = JSON.parse(fs.readFileSync("monsters.json").toString()).data;
const monsterEvolve = JSON.parse(fs.readFileSync("monsterEvolve.json").toString()).data;
// locale.monster.zh.json
// 原始檔案在Asset Bundle中，需要事先轉檔成JSON
const translationZh = JSON.parse(fs.readFileSync("locale.monster.zh.json"));

const relations = new Map();
function createRelation(a, b) {
  if(relations.has(a)) {
    relations.get(a).add(b);
  }
  else {
    relations.set(a, new Set([b]));
  }
}
monsterEvolve.forEach(entry => {
  const evolveRule = entry.split("|");

  const baseCardId = parseInt(evolveRule[0]);
  const resultCardId = parseInt(evolveRule[1]);
  createRelation(resultCardId, baseCardId);
});
monsters.forEach(entry => {
  const cardRule = entry.split("|");

  const entryType = cardRule[76];
  if(entryType !== "monster") return;

  const cardId = parseInt(cardRule[0]);
  const switchCardId = parseInt(cardRule[51]);
  if(!isNaN(switchCardId)) {
    createRelation(cardId, switchCardId);
    createRelation(switchCardId, cardId);
  }
});

function buildEqSet(eqSet, cardId) {
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

  const eqSet = buildEqSet(new Set(), cardId);
  eqSet.delete(cardId);

  allMaxData[cardId] = {
    name: translationZh[`MONSTER_${cardId}`] ?? "",
    attribute: cardAttr,
    race: cardRace,
    rarity: cardRarity,
    equivalences: [...eqSet]
  };
});

fs.writeFileSync("cardData.json", JSON.stringify(allMaxData, null, 2));
