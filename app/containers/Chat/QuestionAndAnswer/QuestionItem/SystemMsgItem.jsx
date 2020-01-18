import React, { useEffect } from 'react';

import { liveRoom } from '@global/roomConstants';
import { YsGlobal } from '@global/handleGlobal';

const { chat } = YsGlobal.languageInfo;
const { question } = chat;

function SystemMsgItem(props) {
  useEffect(() => {
    liveRoom.dispatchEvent({ type: 'chatScrollChange' });
  });

  const { msgObj } = props;
  return (
    <li className={`SystemMsgItem ${props.msgObj.msgtype !== 'systemMsg' ? 'NoticeMsgItem' : ''}`}>
      {props.msgObj.msgtype === 'systemMsg' ? (
        <span className="SystemMsgItem_cont">
          <span className="SystemMsgItem_time">{msgObj.time}</span>
          <span className="SystemMsgItem_text">
            {question.feedback1}
            {msgObj.questionMsg}
            {question.feedback2}
          </span>
        </span>
      ) : (
        <span className="SystemMsgItem_text">{msgObj.questionMsg}</span>
      )}
    </li>
  );
}

export default SystemMsgItem;
