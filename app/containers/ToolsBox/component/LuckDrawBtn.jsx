import React from 'react';
import Actions from '@global/actions';
import { liveRoom } from '@global/roomConstants';
import { YsGlobal } from '@global/handleGlobal';
import Signalling from '../../../global/services/SignallingService';

const { toolsBoxInner } = YsGlobal.languageInfo;
const LuckDrawBtn = props => {
  const { luckyState, callRollState, voteState } = props;
  const mySelf = liveRoom.getMySelf();
  const { serial: classSerial } = YsGlobal.roomInfo;

  /* 抽奖 */
  const liveLuckDraw = () => {
    Actions.setModuleData('luckyDraw', {
      winners: [],
    });
    Signalling.sendSignallingToLiveLuckDraw(false, `luck_${classSerial}`, {
      state: 1,
      fromName: mySelf.nickname,
      fromUser: mySelf,
      luckyState: 'ready',
    });
    Actions.setModuleStatus('luckyDraw', 'ready');
  };
  return (
    <li onClick={liveLuckDraw} className={luckyState || callRollState === 'disable' || voteState ? 'disabled' : ''}>
      <i className="icon-choujiang" />
      {toolsBoxInner.draw}
    </li>
  );
};
export default LuckDrawBtn;
