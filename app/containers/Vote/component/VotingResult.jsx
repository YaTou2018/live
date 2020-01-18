import React, { useState } from 'react';

import { Checkbox } from '@components/Form';
import Button from '@components/Button';

import { YsGlobal } from '@global/handleGlobal';
import Hoster from './Hoster';
import Count from './Count';

const { voteCom } = YsGlobal.languageInfo;
const { hosterInner } = voteCom;

const VotingResult = props => {
  const { over, voteInfo, count } = props;
  const { options, pattern, sendVoteUserName, sendVoteTime, subject, desc } = voteInfo;
  const [isPublicResult, setIsPublicResult] = useState(false);

  const publicChange = data => {
    setIsPublicResult(data);
  };

  return (
    <div className="vote-panel voting-res">
      <Hoster hasVoteStatus sendVoteUserName={sendVoteUserName} sendVoteTime={sendVoteTime} pattern={pattern} subject={subject} desc={desc} />
      <Count options={options} count={count} />
      <div className="public-handler">
        {hosterInner.fiveS}
        <Checkbox checked={isPublicResult} className="public-checkbox" onChange={publicChange}>
          {hosterInner.openTheresult}
        </Checkbox>
      </div>
      <div className="pub-btns voting-res">
        <Button type="primary" onClick={() => over(isPublicResult)}>
          {hosterInner.endVote}
        </Button>
      </div>
    </div>
  );
};
export default VotingResult;
