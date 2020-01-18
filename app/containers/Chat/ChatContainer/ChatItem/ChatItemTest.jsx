import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { YsGlobal } from '@global/handleGlobal';
import { emoticonToImg, emoticonToNull } from '../../utils';
import { translateAjax } from '../../service/ajax';

function ChatItemTest(props) {
  const item = props.contents;
  // eslint-disable-next-line prefer-destructuring
  const headerNameClick = props.headerNameClick;
  const [itemlanguage, setItemlanguage] = useState('');

  const translateFn = () => {
    translateAjax(emoticonToNull(item.strmsg))
      .then(res => {
        if (!res.strmsgToLanguage.length) return;
        setItemlanguage(res.strmsgToLanguage);
      })
      .catch(err => {
        console.warn(err);
      });
  };

  useEffect(() => {
    props.onLoads();
  });

  const { isLiveRoom } = YsGlobal.roomInfo;

  return (
    <div className={`${item.isMe ? 'isme' : 'notme'} ChatItemTest${item.who === item.fromName ? '' : ' who_to_who'}`}>
      <p className="user-title" onClick={headerNameClick}>
        <span className="send-time">{item.time}</span>·<span className="username">{item.who}</span>
      </p>
      <div className={`user-body  ${isLiveRoom ? '' : 'user_body_classRoom'}`}>
        {!isLiveRoom && <span className="icon icon-fanyi" onClick={translateFn} />}

        <span className="textInner" style={{ fontSize: `${props.fontSize}px` }} dangerouslySetInnerHTML={emoticonToImg(item.strmsg)} />
        {itemlanguage ? <p className="remind-msg-innerHTML">{itemlanguage}</p> : null}
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    ...state.chat.fontData.nowFont,
  };
};

// 连接组件
export default connect(mapStateToProps)(ChatItemTest);
