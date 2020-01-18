import React from 'react';
import { liveRoom, WB_CONTAINER_ID } from '@global/roomConstants';
import { connect } from 'react-redux';
import DeskTopSharing from '@containers/ShareSmart/deskTopSharing/DeskTopSharing'; // 共享
import ApplyForWheat from '@containers/Chat/ChatInputBox/ApplyForWheat/ApplyForWheat';
import { YsGlobal } from '@global/handleGlobal';
import BaseWhiteboard from './BaseWhiteboard';

const MainWhiteboardSmart = props => {
  const { isShowWhiteBoardLay, isMp4AllFull } = props;
  const { isLiveRoom } = YsGlobal.roomInfo;
  const mySelf = liveRoom.getMySelf() || {};

  const mobileIsfullScreen = isMp4AllFull ? 'mp4-full-screen' : '';
  return (
    <div id={WB_CONTAINER_ID} className={`white-board-outer-layout ${mobileIsfullScreen}`}>
      <BaseWhiteboard />
      {![0, 1].includes(mySelf.role) && isLiveRoom && <ApplyForWheat />}
      {<DeskTopSharing />}
      {isShowWhiteBoardLay && <div className="white-board-lay" />}
    </div>
  );
};

const mapStateToProps = state => ({
  isShowWhiteBoardLay: state.whiteboard.isShowWhiteBoardLay,
  isMp4AllFull: state.Modules.isMp4AllFull,
});
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MainWhiteboardSmart);
