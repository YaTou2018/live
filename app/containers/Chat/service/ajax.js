import Md5 from 'js-md5';
import { jsonp } from '../utils';

export const translateAjax = query => {
  // 翻译功能
  const appid = '20190926000337599';
  const key = 'fFFxmgclVTLMt0kogAbH';
  const salt = new Date().getTime();

  const sign = Md5(appid + query + salt + key);
  let to;
  let from;
  let { language } = navigator;
  if (language) {
    language = language.toLocaleLowerCase();
  }
  let languageType;
  if (language.indexOf('en') > -1) {
    // 英文
    languageType = 'en';
  } else if (language.indexOf('zh') > -1) {
    // 中文
    languageType = 'zh';
  } else if (language.indexOf('nl') > -1) {
    // 荷兰文
    languageType = 'nl';
  } else if (language.indexOf('fr') > -1) {
    // 法语
    languageType = 'fra';
  } else if (language.indexOf('de') > -1) {
    // 德语
    languageType = 'de';
  } else if (language.indexOf('ja') > -1) {
    // 日语
    languageType = 'jp';
  } else if (language.indexOf('it') > -1) {
    // 意大利语
    languageType = 'it';
  } else if (language.indexOf('pt') > -1) {
    // 葡萄牙语
    languageType = 'pt';
  } else if (language.indexOf('es') > -1) {
    // 西班牙语
    languageType = 'spa';
  } else if (language.indexOf('sv') > -1) {
    // 瑞典语
    languageType = 'swe';
  } else if (language.indexOf('ko') > -1) {
    // 韩语
    languageType = 'kor';
  } else if (language.indexOf('ru') > -1) {
    // 俄语
    languageType = 'ru';
  } else if (language.indexOf('th') > -1) {
    // 泰语
    languageType = 'th';
  } else if (language.indexOf('vi') > -1) {
    // 越南语
    languageType = 'vie';
  }
  if (/[\u4e00-\u9fa5]/.test(query)) {
    // 中文
    from = 'zh';
    if (languageType === 'en' || languageType === 'zh') {
      to = 'en';
    } else {
      to = languageType || 'en';
    }
  } else if (/[a-zA-Z]/.test(query)) {
    from = 'en';
    // 英文
    if (languageType === 'en' || languageType === 'zh') {
      to = 'zh';
    } else {
      to = languageType || 'en';
    }
  } else {
    from = 'zh';
    to = languageType || 'en';
  }
  const request = {
    q: query,
    from,
    to,
    appid,
    salt,
    sign,
  };

  return new Promise((resolve, reject) => {
    jsonp({
      // 跨域
      url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
      data: request,
      jsonp: 'jsonpCallback',
      type: 'get',
      success(data) {
        if (data.trans_result && data.trans_result[0]) {
          const { dst = '' } = data.trans_result[0];
          resolve({
            strmsgToLanguage: dst,
          });
        } else {
          reject(new Error('translate error'));
        }
      },
      error(error) {
        reject(error);
      },
    });
  });
};
