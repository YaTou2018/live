import React, { Component } from 'react';
import Toast from '@components/Toast';
import { connect } from 'react-redux';
import Actions from '@global/actions';
import { YsGlobal } from '@global/handleGlobal';
import { liveRoom, ROOM_ROLE, EVENT_TYPE } from '@global/roomConstants';

import VotePubPanel from './component/VotePubPanel';
import VoteCommit from './component/VoteCommit';
import VotingResult from './component/VotingResult';
import VoteResult from './component/VoteResult';
import VoteRecord from './component/VoteRecord';
import VoteService from './VoteService';

import './styles/Vote';
import './styles/VotingResult';

const { voteCom } = YsGlobal.languageInfo;
const { voteInner } = voteCom;
const service = new VoteService();

class Vote extends Component {
  /* 发布投票 */
  pub(voteInfo) {
    const { options } = voteInfo;
    if (options.some((opt, index) => options.filter((_item, i) => i !== index).findIndex(({ content }) => content === opt.content) !== -1)) {
      // eslint-disable-next-line
      Toast.error(voteInner.norapet);
      return;
    }
    service.pub(voteInfo);
  }

  /* 提交投票 */
  voteCommit(options) {
    if ((options.filter(item => item.checked) || []).length < 1) {
      // eslint-disable-next-line
      Toast.error(voteInner.chooseVote);
      return;
    }
    service.voteCommit(options);
  }

  close() {
    const { voteState } = this.props;
    if (voteState === 'isSetVoteInfo') {
      service.voteEnd();
    } else {
      service.close();
    }
  }

  render() {
    const { voteState, onlineStudentNum } = this.props;
    const voteData = JSON.parse(this.props.voteData);

    const mySelf = liveRoom.getMySelf();
    const isShowVotePubPanel = voteState === 'isSetVoteInfo' && voteData.sendVoteUserId === mySelf.id;
    const isShowVoteCommit = voteState === 'voting' && mySelf.role === ROOM_ROLE.STUDENT;
    const isShowVoteRecord = voteState === 'isShowVoteRecord';
    const isShowVotingResult = voteState === 'voting' && mySelf.role !== ROOM_ROLE.STUDENT;
    const isShowVoteResult = voteState === 'isShowVoteResult';
    return (
      <div className="vote" style={{ width: `${isShowVoteRecord ? '4.24rem' : '7.39rem'}` }}>
        <div className="vote-header">
          {YsGlobal.isMobile && <span className="vote-header-back" onClick={() => service.close()}></span>}

          <span className="vote-header-title">{voteInner.votetitle}</span>
          {!YsGlobal.isMobile && <i className="icon icon-del" onClick={() => this.close()}></i>}
        </div>
        {isShowVoteRecord && (
          <VoteRecord
            voteRecordList={voteData.voteRecordList}
            classSerial={YsGlobal.roomInfo.serial}
            startSetVoteInfo={service.startSetVoteInfo}
            removeVoteRecord={service.removeVoteRecord}
            joinVoteDetails={(...args) => service.joinVoteDetails(...args)}
          />
        )}
        {isShowVotePubPanel && <VotePubPanel pub={(...args) => this.pub(...args)} cancel={() => service.close()} />}
        {isShowVoteCommit && <VoteCommit voteInfo={voteData} submit={(...args) => this.voteCommit(...args)} />}
        {isShowVotingResult && <VotingResult voteInfo={voteData} count={onlineStudentNum} over={(...args) => service.voteEnd(...args)} />}
        {isShowVoteResult && <VoteResult voteInfo={voteData} count={onlineStudentNum} />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  onlineStudentNum: state.user.onlineStudentNum,
  voteState: state.Modules.vote.voteState,
  voteData: JSON.stringify(state.Modules.vote.voteData),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Vote);
