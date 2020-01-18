import React from 'react';
import { YsGlobal } from '@global/handleGlobal';
const { voteCom } = YsGlobal.languageInfo;
const VoteRecordList = props => {
  const { joinVoteDetails, removeVoteRecord, listItem } = props;
  const { voteId, subject, isVoting, sendVoteUserName, sendVoteTime } = listItem;
  return (
    <>
      <div className={`record-list-item ${isVoting ? 'votingItem' : ''}`}>
        {isVoting && <span className="vote-status">{voteCom.hosterInner.inTheVote}</span>}
        {!isVoting && (
          <div className="record-list-item_title">
            <span className="remove-item" onClick={() => removeVoteRecord(voteId)} />
          </div>
        )}
        <div className="vote-info">
          <div className="vote-info_cont">
            <div className="vote-info_cont-item">
              <p className="vote-subject">{subject}</p>
              <span className="record-list-item_pattern">{listItem.pattern === 'multi' ? voteCom.hosterInner.multiple : voteCom.hosterInner.choseOne}</span>
            </div>
            <p className="vote-info_cont-item">{listItem.desc}</p>
            <p className="vote-info_cont-item">
              <span className="user-name">{sendVoteUserName}</span>
              <span>{sendVoteTime}</span>
            </p>
          </div>
          <button className="vote-details" onClick={() => joinVoteDetails(listItem)}>
            {voteCom.detail}
          </button>
        </div>
      </div>
    </>
  );
};
export default VoteRecordList;
