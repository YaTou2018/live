import React, { useEffect } from 'react';
import { liveRoom, EVENT_TYPE } from '@global/roomConstants';
import PropTypes from 'prop-types';
import Barrage11 from './plugs/barrage';

import './barrage.scss';
let liveBarrage;

const BarrageComponent = props => {
  const { width, height } = props;

  useEffect(() => {
    liveBarrage = new Barrage11('barrage');
    const handleRoomTextMessage = param => {
      // 判断是否是聊天中的消息
      if (!param || param.message.type !== 0) return;
      if (param.message.msgtype === 'text') {
        liveBarrage.send(param.message.msg);
      }
    };
    const listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    liveRoom.addEventListener(EVENT_TYPE.roomTextMessage, handleRoomTextMessage, listernerBackupid);
    return () => {
      liveRoom.removeBackupListerner(listernerBackupid);
    };
  }, []);

  return <canvas id="barrage" className="live-barrage" style={{ width, height }} />;
};
BarrageComponent.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
};
BarrageComponent.defaultProps = {
  width: '100%',
  height: '100%',
};
export default BarrageComponent;
