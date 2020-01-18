import React, { useEffect } from 'react';
import { YsGlobal } from '@global/handleGlobal';
import Actions from '@global/actions';
import { liveRoom, EVENT_TYPE } from '@global/roomConstants';
import { connect } from 'react-redux';
import Signalling from '@global/services/SignallingService';
const { header } = YsGlobal.languageInfo;

const MyselfVideoBtn = props => {
  const { isVideoLayout, videoDragInfo, roomStatus } = props;
  const switchLayout = () => {
    if (!isVideoLayout) {
      for (const value of Object.values(videoDragInfo)) {
        Actions.deleteVideoDragInfo(value.userId);
        Signalling.sendSignallingVideoDrag({}, value.userId, true);
      }
      Actions.setDoubleVideoId('');
      Signalling.sendSignallingDoubleClickVideo({}, undefined, true);
    }
    Actions.setVideoLayout(!isVideoLayout);
    const data = { roomLayout: !isVideoLayout ? 'videoLayout' : 'aroundLayout' };
    const isDel = YsGlobal.roomInfo.isMettingRoom ? !isVideoLayout : isVideoLayout;
    Signalling.sendSignallingSetRoomLayout(data, isDel);
    if (YsGlobal.roomInfo.maxVideo === 2) {
      Actions.exchangeOne2oneVideoLayout(false);
    }
  };

  const setRoomLayout = handleData => {
    const { name, data } = handleData;
    if (name === 'SetRoomLayout') {
      Actions.setVideoLayout(data.roomLayout === 'videoLayout');
      if (YsGlobal.roomInfo.maxVideo === 2) {
        Actions.exchangeOne2oneVideoLayout(false);
      }
    }
  };

  useEffect(() => {
    const roomLayoutInfo = YsGlobal.msgList.find(item => item.name === 'SetRoomLayout');
    if (roomLayoutInfo) {
      YsGlobal.msgList = YsGlobal.msgList.filter(item => item.name !== 'SetRoomLayout');
      setRoomLayout(roomLayoutInfo);
    }
  }, [roomStatus]);

  useEffect(() => {
    const listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    liveRoom.addEventListener(
      EVENT_TYPE.roomPubmsg,
      res => {
        setRoomLayout(res.message);
      },
      listernerBackupid,
    );
    liveRoom.addEventListener(
      EVENT_TYPE.roomDelmsg,
      res => {
        const { name } = res.message;
        if (name === 'SetRoomLayout') {
          Actions.setVideoLayout(YsGlobal.roomInfo.isMettingRoom);
          if (YsGlobal.roomInfo.maxVideo === 2) {
            Actions.exchangeOne2oneVideoLayout(false);
          }
        }
      },
      listernerBackupid,
    );
    return () => {
      liveRoom.removeBackupListerner(listernerBackupid);
    };
  }, []);

  const hasSwitchLayout = [0, 1].includes(liveRoom.getMySelf().role);
  return hasSwitchLayout && <div className={`switch-layout-btn ${isVideoLayout ? 'off' : 'on'}`} onClick={switchLayout} title={header.switchLayout} />;
};

const mapStateToProps = state => {
  return {
    isVideoLayout: state.classroom.isVideoLayout,
    roomStatus: state.classroom.roomStatus,
    videoDragInfo: state.video.videoDragInfo,
    ...state.chat,
  };
};

export default connect(mapStateToProps)(MyselfVideoBtn);
