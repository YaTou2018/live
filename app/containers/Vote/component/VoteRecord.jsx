import React from 'react';
import { YsGlobal } from '@global/handleGlobal';
import VoteRecordList from './VoteRecordList';
import '../styles/voteRecord.scss';
const { voteCom } = YsGlobal.languageInfo;
const { hosterInner } = voteCom;

const VoteRecord = props => {
  const { voteRecordList = [], startSetVoteInfo, removeVoteRecord, joinVoteDetails } = props;
  const hasVoting = voteRecordList.find(item => item.isVoting);
  return (
    <div className="vote-record-box">
      <div className="start-vote-head">
        <div className="start-vote-headTitle">
          <span className="start-vote-icon"></span>
          <div>
            <p>{voteCom.hosterInner.startTitle1}</p>
            <p>{voteCom.hosterInner.startTitle2}</p>
          </div>
        </div>
        <button className={`start-vote ${hasVoting ? 'disabled' : ''}`} onClick={startSetVoteInfo}>
          {voteCom.hosterInner.beginVote}
        </button>
      </div>
      {voteRecordList.length ? (
        <div className="vote-scrollBar vote-record-history">
          <div className="historyVote">{hosterInner.voteHistoryTitle}</div>

          {voteRecordList
            .sort((a, b) => b.createTime - a.createTime)
            .filter(it => it.subject)
            .map((item, index) => (
              <VoteRecordList key={item.voteId} listItem={item} removeVoteRecord={removeVoteRecord} joinVoteDetails={joinVoteDetails} keyIndex={index} />
            ))}
        </div>
      ) : null}
    </div>
  );
};
export default VoteRecord;
