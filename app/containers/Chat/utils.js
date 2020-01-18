import { emoticonImg, emotReg } from './constent';

export function getNowDate() {
  let timeNow=(new Date().getHours()>=12)?'下午':'上午';
  return `${timeNow}${new Date().getHours()<10? `0${new Date().getHours()}`:new Date().getHours()} : ${new Date().getMinutes()< 10? `0${new Date().getMinutes()}`:new Date().getMinutes()}`;
};

// 获取当前时间或时间戳时间
export function getSendTime(playback, ts) {
  let time;
  if (playback && ts !== undefined) {
    // 是回放者
    const now = new Date(parseInt(ts, 10));
    time = `${toTwo(now.getHours())}:${toTwo(now.getMinutes())}`;
  } else {
    time = `${toTwo(new Date().getHours())}:${toTwo(new Date().getMinutes())}`;
  }
  return time;
}

// 时间戳转时间
export function numToTime(num, format = 'YYYY-MM-DD HH-mm-ss') {
  if (typeof num !== 'number') return '';
  if (`${num}`.length === 10) num *= 1000;
  const time = new Date(num);
  const YYYY = `${time.getFullYear() || '0000'}`;
  const MM = `${toTwo(time.getMonth() + 1) || '00'}`;
  const DD = `${toTwo(time.getDate()) || '00'}`;
  const HH = `${toTwo(time.getHours()) || '00'}`;
  const mm = `${toTwo(time.getMinutes()) || '00'}`;
  const ss = `${toTwo(time.getSeconds()) || '00'}`;
  return format
    .replace(/YYYY/g, YYYY)
    .replace(/MM/g, MM)
    .replace(/DD/g, DD)
    .replace(/HH/g, HH)
    .replace(/mm/g, mm)
    .replace(/ss/g, ss);
}

// 时间个位数转十位数
export function toTwo(num) {
  if (parseInt(num / 10) == 0) {
    return `0${num}`;
  }
  return num;
}

/* 表情文本转换为图片 */
export function emoticonToImg(text) {
  let html = text
    .replace(/\</g, '&lt;')
    .replace(/\>/g, '&gt;')
    .replace(/\n/g, '<br/>')
    .replace(/ /g, '&nbsp;');
  html = html.replace(/\[em_[\d]{1,2}\]/g, function(data) {
    // return `<img class='emoticonImg' src='${emoticonImg[data]}' />`;
    return emoticonImg[data];
  });

  return { __html: html };
}

/* 表情文本转换为空 */
export function emoticonToNull(text) {
  // text = text.replace(/\[em_[\d]{1,2}\]/g, '');
  return text.replace(/\[em_[\d]{1,2}\]/g, '');
}

/* 表情图片转换为文本  */
export function emoticonToText(text) {
  // let reg = /<img [^>]*src=['"]([^'"]+)[^>]*>/gi;
  const html = text
    // .replace(emotReg, str => {
    //   return emoticonImg[str]
    // })
    .replace(/\.\/img\//gi, '')
    .replace(/\.png/gi, '')
    .replace(/&nbsp;/g, ' ');

  // __html = __html
  // .split('')
  const a = Array.prototype.map.call(html, item => {
    if (emotReg.test(item)) {
      return emoticonImg[item];
    }
    return item;
  });
  return html;
}

// 禁止快速点击
export class DissFrequent {
  constructor(frequentMax) {
    this.frequentMax = frequentMax;
    this.waiting = 0;
    this.timer = null;
  }

  surplus() {
    if (this.waiting <= 0) {
      this.waiting = this.frequentMax;
      this.timer = setInterval(() => {
        this.waiting--;
        if (this.waiting <= 0) return clearInterval(this.timer);
      }, 1000);
      return 0;
    }
    return this.waiting;
  }

  clear() {
    clearInterval(this.timer);
  }
}

// jsonp请求
export function jsonp(params) {
  params = params || {};
  params.data = params.data || {};
  var json = params.jsonp ? jsonp(params) : json(params);
  // jsonp请求
  function jsonp(params) {
    // 创建script标签并加入到页面中
    const callbackName = params.jsonp;
    const head = document.getElementsByTagName('head')[0];
    // 设置传递给后台的回调参数名
    params.data.callback = callbackName;
    const data = formatParams(params.data);
    const script = document.createElement('script');
    head.appendChild(script);
    // 创建jsonp回调函数
    window[callbackName] = function(json) {
      head.removeChild(script);
      clearTimeout(script.timer);
      window[callbackName] = null;
      params.success && params.success(json);
    };
    // 发送请求
    script.src = `${params.url}?${data}`;
    // 为了得知此次请求是否成功，设置超时处理
    if (params.time) {
      script.timer = setTimeout(function() {
        window[callbackName] = null;
        head.removeChild(script);
        params.error &&
          params.error({
            message: '超时',
          });
      }, time);
    }
  }
  // 格式化参数
  function formatParams(data) {
    const arr = [];
    for (const name in data) {
      arr.push(`${encodeURIComponent(name)}=${encodeURIComponent(data[name])}`);
    }

    // 添加一个随机数，防止缓存
    arr.push(`v=${random()}`);
    return arr.join('&');
  }

  // 获取随机数
  function random() {
    return Math.floor(Math.random() * 10000 + 500);
  }
}


