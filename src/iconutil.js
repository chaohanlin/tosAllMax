export function getCardIconUrl(id) {
  return `https://d1h5mn9kk900cf.cloudfront.net/toswebsites/gallery/icons/${id.toString().padStart(4, '0')}.jpg`;
}

const attrNames = [null, "water", "fire", "earth", "light", "dark"];
export function getAttrIconUrl(attr) {
  return `https://hiteku.github.io/img/tos/-/${attrNames[attr ?? 0]}.png`;
}

const raceNames = [null, "human", "beast", "elf", "dragon", "god", null, null, "demon", null, "machina"];
export function getRaceIconUrl(race) {
  return `https://hiteku.github.io/img/tos/-/${raceNames[race ?? 0]}.png`;
}
