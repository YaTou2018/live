import React, { useEffect } from 'react';
import { YsGlobal } from '@global/handleGlobal';
import { connect } from 'react-redux';

function ChatItemNotice(props) {
  const {
    userListInner,
    chat: { chatInput },
  } = YsGlobal.languageInfo;
  const { contents } = props;

  useEffect(() => {
    props.onLoads();
  });
  return (
    <div className="ChatItemNotice" style={{ fontSize: `${props.fontSize / 100}rem` }}>
      <span
        className={`noticeWarp ${
          contents.data.test === userListInner.button.audio.on.title || contents.data.test === userListInner.button.audio.off.title ? 'jingyin' : ''
        }
        ${contents.data.test === userListInner.button.allmute.on.title || contents.data.test === chatInput.LiftAllGagOrders ? 'jinyan' : ''}`}
      >
        {contents.time ? <span className="noticeTime">{contents.time}</span> : null}
        <span className="notice-test">{contents.data.test}</span>
        {/* 只有送花才会走这里 */}
        {contents.type === 'flowers' ? (
          <span className="flowerMsgWarp">
            <span className="icon" />
            <span>&nbsp; x{contents.data.num}</span>
          </span>
        ) : null}
      </span>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    ...state.chat.fontData.nowFont,
  };
};

// 连接组件
export default connect(mapStateToProps)(ChatItemNotice);
