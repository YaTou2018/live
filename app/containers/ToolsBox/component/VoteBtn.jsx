import React from 'react';
import Actions from '@global/actions';
import { YsGlobal } from '@global/handleGlobal';
import { liveRoom } from '@global/roomConstants';
import Signalling from '../../../global/services/SignallingService';

const { toolsBoxInner } = YsGlobal.languageInfo;
const VoteBtn = props => {
  const { voteState, voteRecordsLen, callRollState } = props;
  const { serial: classSerial } = YsGlobal.roomInfo;

  /* 投票 */
  const handleVoteBtn = () => {
    if (voteRecordsLen) {
      Actions.setModuleStatus('vote', 'isShowVoteRecord');
    } else {
      const date = new Date();
      const data = {
        voteId: classSerial + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + Math.round((Math.random() * 9 + 1) * 10000),
        sendVoteUserId: liveRoom.getMySelf().id,
        status: 'isSetVoteInfo',
      };
      Signalling.sendSignallingToVoteStart(false, data.voteId, data);
    }
  };

  return (
    <li onClick={handleVoteBtn} className={voteState === 'isSetVoteInfo' || callRollState === 'disable' ? 'disabled' : ''}>
      <i className="icon-toupiao" />
      {toolsBoxInner.vote}
    </li>
  );
};
export default VoteBtn;
