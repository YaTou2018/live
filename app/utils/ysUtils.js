/* 判断是否是数组
 * @method isArray
 * @params [object:any] */
export const isArray = object => {
  return Array && Array.isArray && typeof Array.isArray === 'function'
    ? Array.isArray(object)
    : object &&
        typeof object === 'object' &&
        typeof object.length === 'number' &&
        typeof object.splice === 'function' &&
        // 判断length属性是否是可枚举的 对于数组 将得到false
        !{}.propertyIsEnumerable.call(object, 'length');
};
/* 根据文件后缀名判断属于什么文件类型 */
export const getFiletyeByFilesuffix = filesuffix => {
  let filetype;
  if (filesuffix === 'jpg' || filesuffix === 'jpeg' || filesuffix === 'png' || filesuffix === 'gif' || filesuffix === 'ico' || filesuffix === 'bmp') {
    filetype = 'jpg'; // 图片
  } else if (filesuffix === 'doc' || filesuffix === 'docx' || filesuffix === 'rtf') {
    filetype = 'doc'; // 文档
  } else if (filesuffix === 'pdf') {
    filetype = 'pdf'; // pdf
  } else if (filesuffix === 'ppt' || filesuffix === 'pptx' || filesuffix === 'pps') {
    filetype = 'ppt'; // ppt
  } else if (filesuffix === 'txt') {
    filetype = 'txt'; // txt
  } else if (filesuffix === 'xls' || filesuffix === 'xlsx') {
    filetype = 'xlsx'; // xlsx
  } else if (filesuffix === 'mp4' || filesuffix === 'webm') {
    // video:.mp4  , .webm
    filetype = 'mp4';
  } else if (filesuffix === 'mp3' || filesuffix === 'wav') {
    // audio:.mp3 , .wav , .ogg
    filetype = 'mp3';
  } else if (filesuffix === 'zip') {
    // h5
    filetype = 'h5';
  } else if (filesuffix === 'html') {
    // html
    filetype = 'html';
  } else if (filesuffix === 'whiteboard') {
    filetype = 'whiteboard';
  } else {
    filetype = 'other';
  }
  return filetype; // jpg、doc、pdf、ppt、txt、xlsx、mp4、mp3、other
};
/* 获取GUID */
export function getGUID() {
  function GUID() {
    this.date = new Date(); /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
    if (typeof this.newGUID !== 'function') {
      /* 生成GUID码 */
      GUID.prototype.newGUID = () => {
        this.date = new Date();
        let guidStr = '';
        const sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
        const sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
        for (let i = 0; i < 9; i += 1) {
          guidStr += Math.floor(Math.random() * 16).toString(16);
        }
        guidStr += sexadecimalDate;
        guidStr += sexadecimalTime;
        while (guidStr.length < 32) {
          guidStr += Math.floor(Math.random() * 16).toString(16);
        }
        return this.formatGUID(guidStr);
      };
      /* * 功能：获取当前日期的GUID格式，即8位数的日期：19700101 * 返回值：返回GUID日期格式的字条串 */
      GUID.prototype.getGUIDDate = () => this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
      /* * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933 * 返回值：返回GUID日期格式的字条串 */
      GUID.prototype.getGUIDTime = () =>
        this.addZero(this.date.getHours()) +
        this.addZero(this.date.getMinutes()) +
        this.addZero(this.date.getSeconds()) +
        this.addZero(parseInt(this.date.getMilliseconds() / 10, 10));
      /* * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现 * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串 * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串 */
      GUID.prototype.addZero = num => {
        if (Number(num).toString() !== 'NaN' && num >= 0 && num < 10) {
          return `0${Math.floor(num)}`;
        }
        return num.toString();
      };
      /*  * 功能：将y进制的数值，转换为x进制的数值 * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10 * 返回值：返回转换后的字符串 */
      GUID.prototype.hexadecimal = (num, x, y) => {
        if (y !== undefined) {
          return parseInt(num.toString(), y).toString(x);
        }
        return parseInt(num.toString(), 10).toString(x);
      };
      /* * 功能：格式化32位的字符串为GUID模式的字符串 * 参数：第1个参数表示32位的字符串 * 返回值：标准GUID格式的字符串 */
      GUID.prototype.formatGUID = guidStr => {
        const str1 = `${guidStr.slice(0, 8)}-`;
        const str2 = `${guidStr.slice(8, 12)}-`;
        const str3 = `${guidStr.slice(12, 16)}-`;
        const str4 = `${guidStr.slice(16, 20)}-`;
        const str5 = guidStr.slice(20);
        return str1 + str2 + str3 + str4 + str5;
      };
    }
  }
  return new GUID();
}
/**
 * 写本地存储
 * @param {string} key
 * @param {string} value
 */
export const setStorage = (key, value) => {
  const { L } = window;
  if (!L.Utils.localStorage.getItem(key)) {
    L.Utils.localStorage.setItem(key, value);
  }
  return L.Utils.sessionStorage.setItem(key, value);
};
/**
 *  读本地存储
 * @param {string} key
 */
export const getStorage = key => {
  const { L } = window;
  if (L.Utils.sessionStorage.getItem(key)) {
    return L.Utils.sessionStorage.getItem(key);
  }
  return L.Utils.localStorage.getItem(key);
};
/**
 * 加密函数
 * @param str 待加密字符串
 * @returns {string}
 */
export const encrypt = (str, encryptRandom) => {
  if (!str) return str;
  const { L } = window;
  return L.Utils.encrypt(str, encryptRandom);
};
/**
 * 解密函数
 * @param str 待解密字符串
 * @returns {string} */
export const decrypt = (str, encryptRandom) => {
  if (!str) return str;
  const { L } = window;
  return L.Utils.decrypt(str, encryptRandom);
};
/* 获取浏览器基本信息 */
export const getBrowserInfo = () => {
  const { userAgent } = window.navigator;
  const rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
  const rEdge = /edge\/(\d+).(\d+)$/;
  const rFirefox = /(firefox)\/([\w.]+)/;
  const rOpera = /(opera).+version\/([\w.]+)/;
  const rChrome = /(chrome)\/([\w.]+)/;
  const rSafari = /version\/([\w.]+).*(safari)/;
  const uaMatch = ua => {
    let match = rMsie.exec(ua);
    if (match != null) {
      return {
        browser: 'IE',
        version: match[2] || '0',
      };
    }
    match = rEdge.exec(ua);
    if (match != null) {
      return {
        browser: 'Edge',
        version: match[2] || '0',
      };
    }
    match = rFirefox.exec(ua);
    if (match != null) {
      return {
        browser: match[1] || '',
        version: match[2] || '0',
      };
    }
    match = rOpera.exec(ua);
    if (match != null) {
      return {
        browser: match[1] || '',
        version: match[2] || '0',
      };
    }
    match = rChrome.exec(ua);
    if (match != null) {
      return {
        browser: match[1] || '',
        version: match[2] || '0',
      };
    }
    match = rSafari.exec(ua);
    if (match != null) {
      return {
        browser: match[2] || '',
        version: match[1] || '0',
      };
    }
    if (match != null) {
      return {
        browser: '',
        version: '0',
      };
    }
    return {
      browser: 'unknown',
      version: 'unknown',
    };
  };
  const browserMatch = uaMatch(userAgent.toLowerCase());
  const language = navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || navigator.language;
  // 判断访问终端
  const browser = {
    versions: (() => {
      const u = navigator.userAgent;
      return {
        edge: u.indexOf('Edge') > -1, // edge内核
        trident: u.indexOf('Trident') > -1, // IE内核
        presto: u.indexOf('Presto') > -1, // opera内核
        webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
        iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, // 是否iPad
        webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
      };
    })(),
    language: language ? language.toLowerCase() : undefined,
    info: {
      browserName: browserMatch.browser, // 浏览器使用的版本名字
      browserVersion: browserMatch.version, // 浏览器使用的版本号
      appCodeName: navigator.appCodeName, // 返回浏览器的代码名。
      appMinorVersion: navigator.appMinorVersion, // 返回浏览器的次级版本。
      appName: navigator.appName, // 返回浏览器的名称。
      appVersion: navigator.appVersion, //	返回浏览器的平台和版本信息。
      browserLanguage: navigator.browserLanguage, //	返回当前浏览器的语言。
      cookieEnabled: navigator.cookieEnabled, //	返回指明浏览器中是否启用 cookie 的布尔值。
      cpuClass: navigator.cpuClass, //	返回浏览器系统的 CPU 等级。
      onLine: navigator.onLine, //	返回指明系统是否处于脱机模式的布尔值。
      platform: navigator.platform, //	返回运行浏览器的操作系统平台。
      systemLanguage: navigator.systemLanguage, // 返回 OS 使用的默认语言。
      userAgent: navigator.userAgent, // 返回由客户机发送服务器的 user-agent 头部的值。
      userLanguage: navigator.userLanguage, //	返回 OS 的自然语言设置。
    },
  };
  return browser;
};
/* 返回操作系统 */
export const detectOS = () => {
  const sUserAgent = navigator.userAgent;
  const isWin = navigator.platform === 'Win32' || navigator.platform === 'Windows';
  const isMac = navigator.platform === 'Mac68K' || navigator.platform === 'MacPPC' || navigator.platform === 'Macintosh' || navigator.platform === 'MacIntel';
  if (isMac) return 'Mac';
  const isUnix = navigator.platform === 'X11' && !isWin && !isMac;
  if (isUnix) return 'Unix';
  const isLinux = String(navigator.platform).indexOf('Linux') > -1;
  if (isLinux) return 'Linux';
  if (isWin) {
    const isWin2K = sUserAgent.indexOf('Windows NT 5.0') > -1 || sUserAgent.indexOf('Windows 2000') > -1;
    if (isWin2K) return 'Win2000';
    const isWinXP = sUserAgent.indexOf('Windows NT 5.1') > -1 || sUserAgent.indexOf('Windows XP') > -1;
    if (isWinXP) return 'WinXP';
    const isWin2003 = sUserAgent.indexOf('Windows NT 5.2') > -1 || sUserAgent.indexOf('Windows 2003') > -1;
    if (isWin2003) return 'Win2003';
    const isWinVista = sUserAgent.indexOf('Windows NT 6.0') > -1 || sUserAgent.indexOf('Windows Vista') > -1;
    if (isWinVista) return 'WinVista';
    const isWin7 = sUserAgent.indexOf('Windows NT 6.1') > -1 || sUserAgent.indexOf('Windows 7') > -1;
    if (isWin7) return 'Win7';
    const isWin8 = sUserAgent.indexOf('Windows NT 6.2') > -1 || sUserAgent.indexOf('Windows 8') > -1;
    if (isWin8) return 'Win8';
    const isWin10 = sUserAgent.indexOf('Windows NT 10.0') > -1 || sUserAgent.indexOf('Windows 10') > -1;
    if (isWin10) return 'Win10';
  }
  return 'Other';
};
export const getDeviceType = () => {
  if (detectOS() === 'Mac') {
    return 'MacPC';
  }
  return 'WindowPC';
};

// 全屏
export const fullScreen = (element = document.documentElement) => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
};

// 退出全屏
export const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};

/** 返回正处于全屏状态的Element节点，如果当前没有节点处于全屏状态，则返回null。 */
export const getFullscreenElement = () => {
  const fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
  return fullscreenElement;
};

// 无引用可以被删除@11.26
// export const getSpecifyRoleList = (specifyRoleIdentification, allUser) => {
//   if (specifyRoleIdentification === undefined || allUser === undefined) {
//     return {};
//   }
//   const rolelist = {};
//   Object.values(allUser).forEach(user => {
//     if (!rolelist[user.role]) {
//       rolelist[user.role] = {};
//     }
//     rolelist[user.role][user.id] = user;
//   });
//   const specifyRole = rolelist[specifyRoleIdentification] || {};
//   return specifyRole;
// };

export const windowClose = () => {
  window.opener = null;

  window.open('', '_self');

  window.close();

  if (window) {
    window.location.href = 'about:blank';
  }
};
