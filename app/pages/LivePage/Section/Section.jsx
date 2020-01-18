import React from 'react';
import { connect } from 'react-redux';
import CallRoll from '@containers/callRollAndSignIn/callRoll'; // 点名
import PlugCheck from '@containers/ShareSmart/plugCheck/PlugCheck'; // 插件检查
import LuckyDraw from '@containers/LuckyDraw/LuckyDraw'; // 抽奖
import Vote from '@containers/Vote/Vote'; // 投票答题
import Answer from '@containers/Answer/Answer'; // 投票答题
import ShowAlert from '@containers/ShowAlert/ShowAlert'; // 弹框
import Notification from '@containers/Notification/Notification'; // 通知
import YSDrag from '@containers/YSDrag/YSDrag'; // 拖拽
import ModalBackdrop from '@components/ModalBackdrop/ModalBackdrop'; // 弹框遮罩层
import UploadPictures from '@containers/UploadPictures';
import { liveRoom } from '@global/roomConstants';
import { YsGlobal } from '@global/handleGlobal';
import Actions from '@global/actions';
import { emitter } from '@utils';
import MainWhiteboard from '../../../containers/MainWhiteboard/MainWhiteboard';
import StudentVideoList from '../../../containers/StudentVideoList/StudentVideoList';
import './section.scss';

class Section extends React.Component {
  self = liveRoom.getMySelf();

  constructor() {
    super();
    emitter.on('room-msglist', this.handlerRoomMsglist.bind(this));
  }

  handlerRoomMsglist({ data }) {
    data.forEach(item => {
      if (item.name === 'isShowUpDataPicture') {
        this.props.changeUpdatapic(true);
      }
    });
  }

  onStart() {
    // this.setState({ activeDrags: ++this.state.activeDrags });
  }

  onDrag() {
    // console.error('===> args: ', args);
  }

  onStop() {
    // console.error('===> args: ', args);
  }

  render() {
    const dragHandlers = {
      onStart: this.onStart.bind(this),
      onStop: this.onStop.bind(this),
      onDrag: this.onDrag.bind(this),
    };
    const { toolsBoxState = {}, luckyState, modalIsShow, answerState, visible, isShowUpPic } = this.props;
    const { luckyDraw, vote, callRoll, answer } = JSON.parse(toolsBoxState);
    const mySelf = liveRoom.getMySelf();
    const isShowVotePubPanel = vote.voteState === 'isSetVoteInfo' && vote.voteData.sendVoteUserId === mySelf.id;
    const { maxVideo } = YsGlobal.roomInfo;

    return (
      <div id="section" className="section">
        {(luckyState ||
          (vote.voteState !== 'isSetVoteInfo' && vote.voteState !== '') ||
          isShowVotePubPanel ||
          !['', 'disable'].includes(callRoll.callRollState) ||
          modalIsShow ||
          (answerState && answerState !== 'disable') ||
          isShowUpPic ||
          visible === 'deviceSetting') && <div className="NoPermission" />}
        <div className="modules">
          {!['', 'disable'].includes(callRoll.callRollState) && (
            <YSDrag moduleName="callRoll" bounds=".modules" dragHandlers={dragHandlers}>
              <CallRoll />
            </YSDrag>
          )}
          {luckyDraw.luckyState !== '' && (
            <div className="luckyDraw-box">
              <LuckyDraw />
            </div>
          )}
          {((vote.voteState !== 'isSetVoteInfo' && vote.voteState !== '') || isShowVotePubPanel) && (
            <YSDrag bounds=".modules" handle=".vote-header" zIndex={102}>
              <Vote />
            </YSDrag>
          )}
          {!['', 'disable'].includes(answer.answerState) && (
            <YSDrag bounds=".modules" handle=".answer-header">
              <Answer />
            </YSDrag>
          )}
          {isShowUpPic ? (
            <YSDrag dragHandlers={dragHandlers}>
              <UploadPictures />
            </YSDrag>
          ) : null}
        </div>
        <MainWhiteboard />
        {maxVideo !== 2 && <StudentVideoList />}
        <ShowAlert />
        <Notification />
        <PlugCheck />
        <ModalBackdrop />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  toolsBoxState: JSON.stringify(state.Modules),
  fullScreen: state.whiteboard.isFullScreen,
  luckyState: state.Modules.luckyDraw.luckyState,
  voteState: state.Modules.vote.voteState,
  callRollState: state.Modules.callRoll.callRollState,
  answerState: state.Modules.answer.answerState,
  modalIsShow: state.common.modalIsShow,
  visible: state.common.visible,
  isShowUpPic: state.Modules.updataPicture.isShowUpPic,
});

const mapDispatchToProps = () => ({
  changeUpdatapic: data => {
    Actions.updataPicCount(data);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Section);
