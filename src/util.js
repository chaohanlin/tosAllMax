// 時間距離現在超過30天
const WARNING_THRESHOLD_DAYS = 30;
export function needTimeWarning(time) {
  // 86400000 = 24*60*60*1000
  return new Date().getTime() - new Date(time).getTime() > WARNING_THRESHOLD_DAYS * 86400000;
}
