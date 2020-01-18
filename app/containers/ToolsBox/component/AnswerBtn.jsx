import React from 'react';
import Actions from '@global/actions';
import { YsGlobal } from '@global/handleGlobal';
import Signalling from '../../../global/services/SignallingService';

const { toolsBoxInner } = YsGlobal.languageInfo;
const AnswerBtn = props => {
  const { answerState } = props;
  const { serial: classSerial } = YsGlobal.roomInfo;

  const handleBlockAnswer = () => {
    if (answerState !== '') return;
    Actions.setModuleStatus('answer', 'creating');
    Signalling.sendAnswerCreated(false, { status: 'occupyed' }, classSerial);
  };
  return (
    <li onClick={handleBlockAnswer} className={answerState === 'disable' ? 'disabled' : ''}>
      <i className="iconfont icon-answer" />
      {toolsBoxInner.answer}
    </li>
  );
};
export default AnswerBtn;
