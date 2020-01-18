// import React from 'react';
import React, { useState, useEffect } from 'react';
import { emoticonToNull, getNowDate } from '../utils';
import { translateAjax } from '../service/ajax';
import { YsGlobal } from '../../../global/handleGlobal';
const { header } = YsGlobal.languageInfo;

export function RemindMsg(props) {
  const { test } = props;
  // 翻译后的消息字符串
  const [strmsgToLanguage, setStrmsgToLanguage] = useState('');

  const translateFn = () => {
    translateAjax(emoticonToNull(test))
      .then(res => {
        if (!res.strmsgToLanguage.length) return;
        setStrmsgToLanguage(res.strmsgToLanguage);
      })
      .catch(err => {
        console.warn(err);
      });
  };
  if (strmsgToLanguage) {
    translateFn();
  }

  useEffect(() => {
    const $msgWrap = document.querySelector('.remind-msg');
    if (!$msgWrap || YsGlobal.isMobile) return;
    props.getH($msgWrap.offsetHeight);
  }, [test, strmsgToLanguage]);

  return (
    <>
      {YsGlobal.isMobile && <p className="notice_gg_time">{getNowDate()}</p>}
      <div className="remind-msg">
        {!YsGlobal.isMobile && (
          <div className="remind-msg-header">
            <span>{header.NoticeLanguage}</span>
            <div className="remind-msg_btn">
              <span className="icon icon-fanyi" onClick={translateFn} />
              <span className="icon icon-del" onClick={props.remindClose}></span>
            </div>
          </div>
        )}

        {YsGlobal.isMobile && <div className="remind_icon" />}
        <div className="remind-msg-contest">
          {test}
          {strmsgToLanguage ? <p className="remind-msg-innerHTML">{strmsgToLanguage}</p> : null}
        </div>
        {YsGlobal.isMobile && <span className="icon icon-fanyi" onClick={translateFn} />}
      </div>
    </>
  );
}

export default RemindMsg;
