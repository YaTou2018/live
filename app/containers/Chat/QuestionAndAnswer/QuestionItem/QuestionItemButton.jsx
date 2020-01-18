import React, { useState } from 'react';
import { liveRoom } from '@global/roomConstants';

import UserService from '@global/services/UserService';

import { YsGlobal } from '@global/handleGlobal';
import Signalling from '../../../../global/services/SignallingService';

const { chat } = YsGlobal.languageInfo;
const { question } = chat;

// class QuestionItemButton extends Component {
//     constructor(props) {
//         super(props);

//     }
function QuestionItemButton(props) {
  // 是否已经点击通过
  const [isPassed, setIsPassed] = useState(false);

  // const {questionType, fromID=''} = props.msgObj;
  const { msgObj } = props;
  // 获取发送人的角色 如果是老师或者助教 就没有通过和回复
  const fromRole = (UserService.getUser(msgObj.fromID) || {}).role;

  // 删除
  const questionItemDel = () => {
    Signalling.sendSignallingToLiveQuestions(false, msgObj.id, { delQuestionMsgId: msgObj.id, type: 1 });
  };

  // 通过
  const questionItemPass = () => {
    // isPassed = true;
    setIsPassed(true);

    const dataToServer = {
      hasPassed: true,
      msg: msgObj.questionMsg,
      type: 1,
      id: msgObj.id,
      time: msgObj.tiem,
      toUserID: '',
      toUserNickname: msgObj.fromName,
      msgtype: 'text',
    };
    const mySelf = liveRoom.getMySelf();
    // 由于服务器分服，对sender数据做兼容性处理 , tudo
    dataToServer.sender = {
      id: mySelf.id,
      role: mySelf.role,
      nickname: mySelf.nickname,
    };
    Signalling.sendSignallingToLiveQuestions(false, msgObj.id, dataToServer);
  };

  // 回复
  const questionItemAnswer = () => {
    liveRoom.dispatchEvent({
      type: 'onAnsClick',
      message: { associatedMsgID: msgObj.id, associatedMsgQuestion: msgObj.questionMsg, toUserID: msgObj.fromID },
    });
    if (isPassed) return;
    questionItemPass();
  };

  return (
    // eslint-disable-next-line react/jsx-no-comment-textnodes
    <div className="QuestionItemButton">
      {msgObj.questionType === 'question' && fromRole !== 0 && fromRole !== 1 ? (
        <div className="item_pass item_btn" onClick={questionItemPass}>
          <span className="icon icon-check"></span>
          {question.passOperation}
        </div>
      ) : null}
      {msgObj.questionType === 'question' || (msgObj.questionType === 'pass' && fromRole !== 0 && fromRole !== 1) ? (
        <div className="item_answer item_btn " onClick={questionItemAnswer}>
          <span className="icon icon-msg"></span>
          {question.answerStatus}
        </div>
      ) : null}
      <div className="item_del item_btn" onClick={questionItemDel}>
        <span className="icon icon-delecte"></span>
        {question.delOperation}
      </div>
    </div>
  );
}

export default QuestionItemButton;
