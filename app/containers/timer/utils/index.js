/* 计算时间差，转为hh,mm,ss */
function getTimeDifferenceToFormat(start, end) {
  const difference = end - start; // 时间差的毫秒数
  if (difference >= 0) {
    // 计算出相差天数
    const days = Math.floor(difference / (24 * 3600 * 1000));
    // 计算出小时数
    const leave1 = difference % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
    const hours = Math.floor(leave1 / (3600 * 1000));
    // 计算相差分钟数
    const leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
    let minutes = Math.floor(leave2 / (60 * 1000));
    // 计算相差秒数
    const leave3 = leave2 % (60 * 1000); // 计算分钟数后剩余的毫秒数
    let seconds = Math.round(leave3 / 1000);
    let daysAddHour = hours + days * 24; // 加上天数的小时数
    const clock = {};
    if (seconds >= 60) {
      seconds = 0;
      minutes += 1;
    }
    if (minutes >= 60) {
      minutes = 0;
      daysAddHour += 1;
    }
    clock.hh = daysAddHour > 9 ? daysAddHour : `0${daysAddHour}`;
    clock.mm = minutes > 9 ? minutes : `0${minutes}`;
    clock.ss = seconds > 9 ? seconds : `0${seconds}`;
    return clock;
  }
  return false;
}

export default {
  getTimeDifferenceToFormat,
};
