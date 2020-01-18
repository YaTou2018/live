import React from 'react';
import Actions from '@global/actions';
import { YsGlobal } from '@global/handleGlobal';
import Signalling from '../../../global/services/SignallingService';

const { toolsBoxInner } = YsGlobal.languageInfo;
const CallRollBtn = props => {
  const { callRollState, voteState } = props;
  const { serial: classSerial } = YsGlobal.roomInfo;

  const handleBlockCallRoll = () => {
    if (callRollState === 'calling') return;
    Actions.setModuleStatus('callRoll', 'call');
    Signalling.sendSignallingFromLiveCallRoll(false, { status: 'occupyed' }, classSerial);
  };

  return (
    <li onClick={handleBlockCallRoll} className={callRollState === 'disable' || voteState ? 'disabled' : ''}>
      <i className="icon-dianming" />
      {toolsBoxInner.rollName}
    </li>
  );
};
export default CallRollBtn;
