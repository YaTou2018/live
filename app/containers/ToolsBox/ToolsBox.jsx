import React from 'react';
import { connect } from 'react-redux';
import Actions from '@global/actions';
import { YsGlobal } from '@global/handleGlobal';
import ShareBtn from './component/ShareBtn';
import CallRollBtn from './component/CallRollBtn';
import AnswerBtn from './component/AnswerBtn';
import LuckDrawBtn from './component/LuckDrawBtn';
import VoteBtn from './component/VoteBtn';
import NoticeBoardBtn from './component/NoticeBoardBtn';
import NoticeInformBtn from './component/NoticeInformBtn';
import './toolsBox.scss';
import './iconfont/style.scss';
import './fonts/iconfont.css';
const { toUpdata } = YsGlobal.languageInfo;
const ToolsBox = props => {
  const { luckyState, voteState, voteRecordsLen, callRollState, toolsBoxInfo, answerState } = props;
  const { hasShareBtn, hasCallRollBtn, hasLuckDrawBtn, hasVoteBtn, hasNoticeBoardBtn, hasNoticeInformBtn, hasUpDataPicture, hasAnswerBtn } = JSON.parse(
    toolsBoxInfo,
  );
  // 上传图片
  const handleUploadPictrues = () => {
    if (props.isShowUpPic) return;
    props.changeUpdatapic(true);
  };
  return (
    <ul className={`tools-box ${props.isSupportPageTrun ? 'top0' : ''}`}>
      <span className="triangle"></span>
      {hasShareBtn && <ShareBtn />}
      {hasCallRollBtn && <CallRollBtn callRollState={callRollState} voteState={voteState} />}
      {hasAnswerBtn && <AnswerBtn answerState={answerState} />}
      {hasLuckDrawBtn && <LuckDrawBtn luckyState={luckyState} callRollState={callRollState} voteState={voteState} />}
      {hasVoteBtn && <VoteBtn voteRecordsLen={voteRecordsLen} voteState={voteState} callRollState={callRollState} />}
      {hasNoticeBoardBtn && <NoticeBoardBtn />}
      {hasNoticeInformBtn && <NoticeInformBtn />}
      {hasUpDataPicture ? (
        <li onClick={handleUploadPictrues}>
          <i className="iconfont icon-upload" />
          {toUpdata.upLoadPicture}
        </li>
      ) : null}
    </ul>
  );
};
const mapStateToProps = state => {
  const { Modules } = state;
  return {
    answerState: Modules.answer.answerState,
    callRollState: Modules.callRoll.callRollState,
    luckyState: Modules.luckyDraw.luckyState,
    voteState: Modules.vote.voteState,
    voteRecordsLen: Modules.vote.voteData.voteRecordList.length,
    isShowUpPic: Modules.updataPicture.isShowUpPic,
  };
};

const mapDispatchToProps = () => ({
  changeUpdatapic: data => {
    Actions.updataPicCount(data);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ToolsBox));
