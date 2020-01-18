import React from 'react';
import { liveRoom, PUBLISH_STATE } from '@global/roomConstants';
import './videoBackGround.scss';
import { YsGlobal } from '@global/handleGlobal';

const { video } = YsGlobal.languageInfo;
const VideoBackGround = props => {
  const { publishstate, hasVideo, teacherId } = props;
  const setBg = () => {
    if (!hasVideo) {
      return 'teacher-no-camera';
    }
    if (publishstate === PUBLISH_STATE.AUDIOONLY || publishstate === PUBLISH_STATE.MUTEALL) {
      return 'teacher-close-camera';
    }
    return 'teacher-placeholder-bg';
  };
  const mySelf = liveRoom.getMySelf() || {};
  return (
    <div className={`video-bg ${setBg()}`}>
      {teacherId && !publishstate && mySelf.role !== 0 && <span className="reminder">{video.videoReminder}</span>}
    </div>
  );
};
export default React.memo(VideoBackGround);
