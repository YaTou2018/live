/* 聊天区-头部 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { YsGlobal } from '@global/handleGlobal';
import { liveRoom, EVENT_TYPE } from '@global/roomConstants';

const { chat, applyForWheat } = YsGlobal.languageInfo;
const { chatTitleBoxInner } = chat;

const ChatTitleBox = props => {
  const { selectChat, setChatIndex, isClassBegin } = props;
  const { role } = liveRoom.getMySelf();
  const [applyWheatLen, setApplyWheatLen] = useState(0);
  const [chatType, setChatType] = useState({
    chat: false,
    question: false,
    applyWheat: false,
  });

  useEffect(() => {
    const listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    liveRoom.addEventListener(
      EVENT_TYPE.roomTextMessage,
      param => {
        if (param.message.type === 1) {
          if (selectChat === 1) return;
          setChatType(Object.assign({}, chatType, { question: true }));
        } else if (param.message.type === 0) {
          if (selectChat === 0) return;
          setChatType(Object.assign({}, chatType, { chat: true }));
        }
      },
      listernerBackupid,
    );
    liveRoom.addEventListener(
      EVENT_TYPE.roomPubmsg,
      param => {
        const pubmsgData = param.message;
        switch (pubmsgData.name) {
          case 'LiveQuestions':
            if (selectChat === 1) return;
            setChatType(Object.assign({}, chatType, { question: true }));
            break;
          case 'Server_Sort_Result': {
            // 订阅排序器结果
            if (param.message.sortResult && param.message.sortResult.length !== applyWheatLen) {
              setApplyWheatLen(param.message.sortResult.length);
              if (selectChat === 2) return;
              setChatType(Object.assign({}, chatType, { applyWheat: true }));
            }
            break;
          }
          default:
            break;
        }
      },
      listernerBackupid,
    );

    return () => {
      liveRoom.removeBackupListerner(listernerBackupid);
    };
  }, [applyWheatLen, chatType, selectChat]);

  const reSetChatType = type => {
    switch (type) {
      case 0:
        setChatType(Object.assign({}, chatType, { chat: false }));
        break;
      case 1:
        setChatType(Object.assign({}, chatType, { question: false }));
        break;
      case 2:
        setChatType(Object.assign({}, chatType, { applyWheat: false }));
        break;
      default:
        break;
    }
  };

  return (
    <>
      {YsGlobal.roomInfo.isLiveRoom ? (
        <div className="chat-title">
          <div
            className={`option option-chat ${selectChat === 0 ? ' active' : ''}`}
            onClick={() => {
              setChatIndex(0);
              reSetChatType(0);
            }}
          >
            {chatTitleBoxInner.chitChat}
            {selectChat !== 0 && chatType.chat && <i className="tips"></i>}
          </div>
          <div
            className={`option option-ques ${selectChat === 1 ? 'active' : ''} ${isClassBegin ? '' : 'hide'}`}
            onClick={() => {
              setChatIndex(1);
              reSetChatType(1);
            }}
          >
            {chatTitleBoxInner.ask}
            {selectChat !== 1 && chatType.question && <i className="tips"></i>}
          </div>
          {[0, 1].includes(role) && YsGlobal.roomInfo.maxVideo - 1 > 0 ? (
            <div
              className={`option option-onWheat ${selectChat === 2 ? 'active' : ''} ${isClassBegin ? '' : 'hide'}`}
              onClick={() => {
                setChatIndex(2);
                reSetChatType(2);
              }}
            >
              {applyForWheat.onWheat}
              {selectChat !== 2 && chatType.applyWheat && <i className="tips"></i>}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
};
ChatTitleBox.propTypes = {
  selectChat: PropTypes.number,
  setChatIndex: PropTypes.func,
};
export default ChatTitleBox;
