export const objectFilter = (obj, predicate) => Object.keys(obj).map(key => predicate(obj[key]));
// 无引用可以被删除@11.26
// export const clearFunction = obj => {
//   const temp = {};
//   Object.keys(obj)
//     .filter(key => typeof obj[key] !== 'function')
//     .forEach(key => {
//       temp[key] = obj[key];
//     });
//   return temp;
// };

/**
 * 节流方法
 * @access
 *  */

export const throttle = (func, wait, opt) => {
  const that = this;
  let timeout;
  let context;
  let args;
  let previous = 0;
  const options = !opt ? {} : opt;
  const later = () => {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    func.apply(context, args);
    if (!timeout) {
      context = null;
      args = null;
    }
  };

  const throttled = (...arg) => {
    const now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
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
  throttled.cancel = () => {
    clearTimeout(timeout);
    timeout = null;
  };
  return throttled;
};
