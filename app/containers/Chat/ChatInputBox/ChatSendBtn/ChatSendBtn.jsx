/* 聊天区-发送按钮 */
import React, { useState, useEffect } from 'react';
import { YsGlobal } from '@global/handleGlobal';
import { liveRoom, EVENT_TYPE, ROOM_ROLE } from '@global/roomConstants';
import { myself } from '@utils/';
const { chatSendBtn, question } = YsGlobal.languageInfo.chat;

const ChatSendBtn = props => {
  /* 处理用户属性改变 */
  const [disablechat, setDisableChat] = useState(false);
  const mySelf = liveRoom.getMySelf() || {};
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
  const { selectChat, liveAllNoChatSpeaking, isTeacher, handleEditableOnButtonClick } = props;
  const isDisabledChat = (YsGlobal.roomInfo.isLiveRoom ? liveAllNoChatSpeaking : disablechat) && !isTeacher;
  const text = mySelf.role !== ROOM_ROLE.STUDENT ? question.answerStatus : chatSendBtn.subBtn;
  return (
    <button type="button" className="sendBtn" onClick={() => handleEditableOnButtonClick()} disabled={isDisabledChat}>
      {selectChat === 0 ? chatSendBtn.sendBtn : text}
    </button>
  );
};
export default ChatSendBtn;
