export function getCardIconUrl(id) {
  return `https://d1h5mn9kk900cf.cloudfront.net/toswebsites/gallery/icons/${id.toString().padStart(4, '0')}.jpg`;
}
