export function BrowserCheck() {
  const N = navigator.appName;
  const ua = navigator.userAgent;
  let tem;
  let M = ua.match(
    /(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i,
  );
  // eslint-disable-next-line no-cond-assign
  if (M && (tem = ua.match(/version\/([.\d]+)/i)) != null) {
    // eslint-disable-next-line prefer-destructuring
    M[2] = tem[1];
  }
  M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
  return M;
}
