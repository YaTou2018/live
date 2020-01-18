const deviceMapping = {
  WindowPC: 'netWindowPc',
  MacPC: 'netMacPc',
  AndroidPhone: 'netAndroid',
  AndroidPad: 'netAndroidPad',
  iPhone: 'netIPhone',
  iPad: 'netIPad',
  WindowClient: 'netWindowClient',
  MacClient: 'netMacClient',
  AndroidTV: 'netAndroidTV',
};
function deviceTypeClassNameInfo(clientDeviceVersionInfo) {
  let deviceTypeClassName = '';
  deviceTypeClassName = deviceMapping[clientDeviceVersionInfo];
  return deviceTypeClassName;
}

function throttle(func, wait, options = {}) {
  const that = this;
  let timeout;
  let context;
  let args;
  let previous = 0;
  // tslint:disable-next-line:only-arrow-functions
  const later = () => {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    func.apply(context, args);
    if (!timeout) {
      context = null;
      args = null;
    }
  };
  // tslint:disable-next-line:only-arrow-functions
  const throttled = (...arg) => {
    const now = new Date().getTime();
    if (!previous && options.leading === false) {
      previous = now;
    }
    const remaining = wait - (now - previous);
    context = that;
    args = arg;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
      if (!timeout) {
        context = null;
        args = null;
      }
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
  };
  // tslint:disable-next-line:only-arrow-functions
  throttled.cancel = () => {
    clearTimeout(timeout);
    timeout = null;
  };
  return throttled;
}

export default {
  deviceTypeClassNameInfo,
  throttle,
};
