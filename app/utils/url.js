export const getUrlParams = (key, url) => {
  /* charCodeAt()：返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数。
   fromCharCode()：接受一个指定的 Unicode 值，然后返回一个字符串。
   encodeURIComponent()：把字符串作为 URI 组件进行编码。
   decodeURIComponent()：对 encodeURIComponent() 函数编码的 URI 进行解码。 */
  let { href } = window.location;
  /* if (window.YsConstant) {
    href = ysUtils.decrypt(window.YsConstant.SERVICEINFO.joinUrl) || window.location.href;
  } */
  href = url || href;
  // let urlAdd = decodeURI(href);
  const urlAdd = decodeURIComponent(href);
  const urlIndex = urlAdd.indexOf('?');
  const urlSearch = urlAdd.substring(urlIndex + 1);
  const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`, 'i'); // reg表示匹配出:$+url传参数名字=值+$,并且$可以不存在，这样会返回一个数组
  const arr = urlSearch.match(reg);
  if (arr != null) {
    return arr[2];
  }
  return '';
};

export const getServiceInfo = () => {
  let protocol = window.location.protocol ? window.location.protocol.replace(/:/g, '') : 'https';
  const host = getUrlParams('host');
  const port = window.YsGlobal.loginType === 88 ? 80 : 443;
  protocol = window.YsGlobal.loginType === 88 ? 'http' : protocol;
  // let aliUrl = host.includes('demo') || host.includes('release') ? 'demo' : 'interaction';
  let aliUrl = 'demo';
  if (host.includes('demo')) {
    aliUrl = 'demo';
  } else if (host.includes('release')) {
    aliUrl = 'release';
  } else {
    aliUrl = 'interaction';
  }
  return {
    protocol,
    host,
    port,
    webRequest: host.includes('demo') || host.includes('release') ? `${protocol}://${host}:${port}` : 'https://api.roadofcloud.com:443',
    aliUrl,
  };
};
