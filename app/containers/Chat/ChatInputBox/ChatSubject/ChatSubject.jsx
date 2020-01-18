/* 聊天区-输入框 */
import React, { useEffect, useState } from 'react';
import { YsGlobal } from '@global/handleGlobal';
import { liveRoom, EVENT_TYPE } from '@global/roomConstants';
import { connect } from 'react-redux';
import { myself } from '@utils/';
const { chatSubject } = YsGlobal.languageInfo.chat;
const ChatSubjectC = props => {
  const [disablechat, setDisableChat] = useState(false);
  /* 处理用户属性改变 */
  useEffect(() => {
    const handleUserPropertyChanged = data => {
      const { user } = data;
      if (myself().id === user.id) {
        setDisableChat(user.disablechat);
      }
    };
    const listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    liveRoom.addEventListener(EVENT_TYPE.roomUserPropertyChanged, handleUserPropertyChanged, listernerBackupid);
    return () => {
      liveRoom.removeBackupListerner(listernerBackupid);
    };
  }, []);
  const { selectUserID, chatMsg, liveAllNoChatSpeaking, handleEditableOnKeyDown, selectChat, selectUserNickname, isTeacher } = props;
  const isDisabledChat = (YsGlobal.roomInfo.isLiveRoom ? liveAllNoChatSpeaking : disablechat) && !isTeacher;
  return (
    <div className="chat-subject">
      <div className={`privateChat${selectChat === 0 && selectUserID !== '' ? '' : ' hide'}`}>
        {chatSubject.onGoing}&nbsp;
        <label className="label_user">{selectUserNickname}</label>
        &nbsp;{chatSubject.private}：
      </div>
      <textarea
        className={`inputContentEditable${selectChat === 0 && selectUserID !== '' ? ' mt' : ''}`}
        style={{ fontSize: `${props.fontSize / 100}rem` }}
        value={chatMsg}
        onChange={e => props.setChatMsg(e)}
        maxLength="140"
        ref={props.onRef}
        placeholder={isDisabledChat ? chatSubject.forbid : chatSubject.maxNumber}
        disabled={isDisabledChat}
        onKeyDown={e => handleEditableOnKeyDown(e)}
      />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    ...state.chat.fontData.nowFont,
  };
};

// 连接组件
export default connect(mapStateToProps)(ChatSubjectC);
