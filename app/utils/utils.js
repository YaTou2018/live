import { liveRoom } from '@global/roomConstants';
import chineseLanguage from '../language/chinese';
import englishLanguage from '../language/english';
import zhTwLanguage from '../language/zh-tw';

/**
 * 获取房间内自己信息
 */
export function myself() {
  return liveRoom.getMySelf();
}

export const emitter = {
  on(eventName, callback) {
    liveRoom.addEventListener(eventName, ({ message = {}, ...args }) => {
      const filterMsgName = ['LiveLuckDraw', /* 'LiveLuckDrawResult',  */'VoteStart', 'voteCommit'/* , 'VoteResult' */];
      if (window.YsGlobal.loginType && filterMsgName.includes(message.name)) {
        return;
      }
      callback({ message, ...args });
    });
  },

  emit(eventName, data) {
    liveRoom.dispatchEvent(eventName, data);
  },
};

export const getDate = (date = new Date()) => {
  const dates = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes()].map(addZero);
  return `${dates[0]}-${dates[1]}-${dates[2]} ${dates[3]}:${dates[4]}`;
};

/**
 * 获取当前日期的GUID格式，即8位数的日期：19700101
 * @param {*} date 时间对象
 * @return {*} 返回GUID日期格式的字条串
 */
export const getGUIDDate = (date = new Date()) => {
  const dates = [date.getMonth() + 1, date.getDate()].map(addZero);
  return `${date.getFullYear()}${dates[0]}${dates[1]}`;
};

/**
 * 获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933
 * @param {*} date 时间对象
 * @return {*} 返回GUID日期格式的字条串
 */
export const getGUIDTime = (date = new Date()) => {
  const dates = [date.getHours(), date.getMinutes(), date.getSeconds(), parseInt(date.getMilliseconds() / 10, 10)].map(addZero);
  return `${dates[0]}-${dates[1]} ${dates[2]}:${dates[3]}`;
};

export const addZero = num => {
  let n = num;
  if (num.toString().length === 1) {
    n = `0${num}`;
  }
  return n;
};
/* 计算时间差，转为hh,mm,ss */
export const getTimeDifferenceToFormat = (start, end) => {
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
};

/* 获取浏览器语言 */
export const getLanguageName = () => {
  let lang = navigator.language || navigator.userLanguage;
  lang = lang.substr(0, 5);
  let languageName = 'chinese';
  if (lang.toLowerCase().match(/zh/g)) {
    if (lang.toLowerCase().match(/tw/g)) {
      languageName = 'zh-tw';
    } else {
      languageName = 'chinese';
    }
  } else if (lang.toLowerCase().match(/en/g)) {
    languageName = 'english';
  }
  return languageName;
};

/* 获取浏览器语言 */
export const getLanguage = languageName => {
  if (languageName === 'english') {
    return englishLanguage; // 英文
  }
  if (languageName === 'zh-tw') {
    return zhTwLanguage; // 繁体
  }
  return chineseLanguage;
};
