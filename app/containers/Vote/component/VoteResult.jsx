import React from 'react';
import { YsGlobal } from '@global/handleGlobal';
import Hoster from './Hoster';
import Count from './Count';
import VoteService from '../VoteService';
const service = new VoteService();
const {
  voteCom: { voteResult },
} = YsGlobal.languageInfo;

const VoteResult = props => {
  const { voteInfo, count } = props;
  const { options, pattern, sendVoteUserName, sendVoteTime, subject, desc } = voteInfo;

  const rightAnswer = options
    .filter(opt => opt.isRight)
    .map(opt => opt.content)
    .join(',');

  return (
    <div className="vote-panel voting-res">
      <div>
        <Hoster hosterTypeInner="true" sendVoteUserName={sendVoteUserName} sendVoteTime={sendVoteTime} pattern={pattern} subject={subject} desc={desc} />
        <Count options={options} count={count} />
        {/* 正确答案 */}
        {rightAnswer.length > 0 && !YsGlobal.isMobile ? (
          <div className="vote-right-answers">
            {voteResult.rightAnswers} : &nbsp;&nbsp;
            {rightAnswer}
          </div>
        ) : (
          ''
        )}
        {YsGlobal.isMobile && (
          <div className="voteBack">
            <button onClick={() => service.close()}>{voteResult.backToLive}</button>
          </div>
        )}
      </div>
    </div>
  );
};
export default VoteResult;
