/* eslint-disable */
!(function(d) {
  let e;

  let n =
    '<svg><symbol id="icon-back" viewBox="0 0 1024 1024"><path d="M408.576 522.922667l382.122667 382.179555a28.444444 28.444444 0 0 1 0 40.220445l-40.220445 40.220444a28.444444 28.444444 0 0 1-40.220444 0L247.694222 522.922667a28.444444 28.444444 0 0 1 0-40.220445L710.257778 20.138667a28.444444 28.444444 0 0 1 40.220444 0l40.220445 40.220444a28.444444 28.444444 0 0 1 0 40.220445L408.576 482.702222a28.444444 28.444444 0 0 0 0 40.220445z"  ></path></symbol></svg>';

  const t = (e = document.getElementsByTagName('script'))[
    e.length - 1
  ].getAttribute('data-injectcss');
  if (t && !d.__iconfont__svg__cssinject__) {
    d.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        '<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>',
      );
    } catch (e) {
      console && console.log(e);
    }
  }
  !(function(e) {
    if (document.addEventListener)
      if (~['complete', 'loaded', 'interactive'].indexOf(document.readyState))
        setTimeout(e, 0);
      else {
        var t = function() {
          document.removeEventListener('DOMContentLoaded', t, !1), e();
        };
        document.addEventListener('DOMContentLoaded', t, !1);
      }
    else
      document.attachEvent &&
        ((o = e),
        (i = d.document),
        (a = !1),
        (c = function() {
          try {
            i.documentElement.doScroll('left');
          } catch (e) {
            return void setTimeout(c, 50);
          }
          n();
        })(),
        (i.onreadystatechange = function() {
          i.readyState == 'complete' && ((i.onreadystatechange = null), n());
        }));
    function n() {
      a || ((a = !0), o());
    }
    let o;
    let i;
    let a;
    let c;
  })(function() {
    let e;
    let t;
    ((e = document.createElement('div')).innerHTML = n),
    (n = null),
    (t = e.getElementsByTagName('svg')[0]) &&
        (t.setAttribute('aria-hidden', 'true'),
        (t.style.position = 'absolute'),
        (t.style.width = 0),
        (t.style.height = 0),
        (t.style.overflow = 'hidden'),
        (function(e, t) {
          t.firstChild
            ? (function(e, t) {
              t.parentNode.insertBefore(e, t);
            })(e, t.firstChild)
            : t.appendChild(e);
        })(t, document.body));
  });
})(window);
