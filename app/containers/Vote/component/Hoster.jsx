import React, { Component } from 'react';

import '../styles/Hoster';
import { YsGlobal } from '@global/handleGlobal';

const { isMobile } = YsGlobal;

const { voteCom } = YsGlobal.languageInfo;
const { inTheVote, voteEnded } = voteCom.hosterInner;
const { hosterInner } = voteCom;
export default class Hoster extends Component {
  render() {
    const { sendVoteUserName, sendVoteTime, pattern, subject, hasVoteStatus, hosterTypeInner, desc } = this.props;
    const voteType = hosterTypeInner ? voteEnded : inTheVote;
    return (
      <div className="hoster">
        <div className="hoster-info">
          {/* <div className="hoster-head" /> */}
          {isMobile && (
            <p className="vote_state" style={{ background: hosterTypeInner ? '#C3C3C3' : '#5a8cdc' }}>
              {voteType}
            </p>
          )}

          <div className="hoster-nick">{sendVoteUserName}</div>
          <div className="hoster-time">
            {hosterInner.from} {isMobile ? sendVoteTime.slice(5) : sendVoteTime} {hosterInner.beginVote}
          </div>
          <div className="triangle"></div>
          {/* {hasVoteStatus && <span className="vote-tag">{hosterInner.inTheVote}</span>} */}
        </div>
        <div className="vote-desc">
          <div className="vote-desc_one">
            <span className="vote_name"> {subject} </span>
            <span className="vote_type">{pattern === 'multi' ? hosterInner.multiple : hosterInner.choseOne}</span>
          </div>
          <div className="desc">{desc}</div>
        </div>
      </div>
    );
  }
}
