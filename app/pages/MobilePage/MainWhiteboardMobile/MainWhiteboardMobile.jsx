import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import actions from '@global/actions';
import { liveRoom, WB_CONTAINER_ID } from '@global/roomConstants';
import WhiteboardService from '@global/services/WhiteboardService';
import { YsGlobal } from '@global/handleGlobal';
import BaseWhiteboard from '../../../containers/MainWhiteboard/BaseWhiteboard';
import './mainWhiteboardMobile.scss';

const MainWhiteboardMobile = props => {
  const { mp4Status, isMp4AllFull } = props;
  const docType = useRef('');
  const mySelf = liveRoom.getMySelf() || {};
  const { isLiveRoom } = YsGlobal.roomInfo;

  const switchFull = () => {
    props.changAllFullFn(!props.isMp4AllFull);
  };

  useEffect(() => {
    const receiveWhiteboardSDKAction = recvEventData => {
      const { cmd = {} } = recvEventData.message;
      const { viewState = {} } = cmd;
      const { documentType } = viewState;
      if (documentType !== undefined && documentType !== docType.current && mySelf.role === 2 && !isLiveRoom) {
        docType.current = documentType;
        WhiteboardService.getYsWhiteBoardManager().changeWhiteBoardConfigration(
          {
            canWBPinch: documentType !== 'dynamicPPT', // 是否能双指缩放
          },
          'default',
        );
      }
    };
    const listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    liveRoom.addEventListener('receiveWhiteboardSDKAction', receiveWhiteboardSDKAction, listernerBackupid);
    return () => {
      liveRoom.removeBackupListerner(listernerBackupid);
    };
  }, [isLiveRoom, mySelf.role]);

  const mobileIsfullScreen = isMp4AllFull ? 'mp4-full-screen' : '';
  return (
    <div id={WB_CONTAINER_ID} className={`whiteBoard-mobile white-board-outer-layout ${mobileIsfullScreen}`}>
      <BaseWhiteboard />
      {mp4Status !== 'end' && <div className={`whiteBoardFull ${mobileIsfullScreen}`} onClick={switchFull} />}
    </div>
  );
};

const mapStateToProps = state => ({
  isClassBegin: state.classroom.isClassBegin,
  mp4Status: state.whiteboard.mp4Status,
  isMp4AllFull: state.Modules.isMp4AllFull,
});
const mapDispatchToProps = () => ({
  changAllFullFn: data => {
    actions.changeAllFull(data);
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(MainWhiteboardMobile);
