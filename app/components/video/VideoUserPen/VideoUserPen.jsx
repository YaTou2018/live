import React, { useState, useEffect } from 'react';
import WhiteboardService from '@global/services/WhiteboardService';
import { liveRoom, EVENT_TYPE } from '@global/roomConstants';
import './VideoUserPen.scss';
const VideoUserPen = props => {
  const { userId } = props;
  const user = liveRoom.getUser(userId) || {};
  const [color, setColor] = useState(user.primaryColor);
  const [candraw, setCandraw] = useState(user.candraw);
  /* 处理用户属性改变 */
  useEffect(() => {
    const handleUserPropertyChanged = () => {
      if (color === user.primaryColor && candraw === user.candraw) {
        return;
      }
      setColor(user.primaryColor);
      WhiteboardService.getYsWhiteBoardManager().changeWhiteBoardConfigration({ primaryColor: user.primaryColor }, 'default');
      setCandraw(user.candraw);
    };
    const listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    liveRoom.addEventListener(EVENT_TYPE.roomUserPropertyChanged, handleUserPropertyChanged, listernerBackupid);
    return () => {
      liveRoom.removeBackupListerner(listernerBackupid);
    };
  }, [candraw, color, user, user.primaryColor]);

  return (
    <div style={{ display: candraw || user.role === 0 ? 'block' : 'none', color }} className="VideoUserPen">
      <em className="icon-tool_pencil" />
    </div>
  );
};
export default VideoUserPen;
