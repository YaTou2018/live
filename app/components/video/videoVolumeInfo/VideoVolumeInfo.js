import React, { useState, useEffect } from 'react';
import { liveRoom } from '@global/roomConstants';
import './videoVolumeInfo.scss';
import { YsGlobal } from '../../../global/handleGlobal';

const VideoVolumeInfo = props => {
  const { audioFlag, userId, isClassBegin } = props;
  const [volumeWidth, setVolumeWidth] = useState(0);

  useEffect(() => {
    if (!userId || (YsGlobal.isSafari && YsGlobal.isMobile)) {
      return () => {
        liveRoom.unregisterAudioVolumeListener(userId);
      };
    }
    if (audioFlag) {
      liveRoom.registerAudioVolumeListener(userId, 100, volumeNum => {
        setVolumeWidth(volumeNum * 4 + 10 /* (0.3 * (volumeNum / 100) + Math.ceil(volumeNum / 20) * 0.06) * 4 */);
      });
    } else {
      setVolumeWidth(0);
      liveRoom.unregisterAudioVolumeListener(userId);
    }
    return () => {
      liveRoom.unregisterAudioVolumeListener(userId);
    };
  }, [audioFlag, userId]);
  const user = liveRoom.getUser(userId) || {};
  return (
    <div className="video-info-box">
      <span className="user-name">{user.nickname}</span>
      {isClassBegin && !(YsGlobal.isSafari && YsGlobal.isMobile) && (
        <div className="volume-box">
          <span className={`volume-icon ${!audioFlag ? 'volume-close' : ''}`} />
          <div className="volume-bar-down">
            <div className="volume-bar-item"></div>
            <div className="volume-bar-item"></div>
            <div className="volume-bar-item"></div>
            <div className="volume-bar-up" style={{ width: `${volumeWidth}%` }}>
              <div className="volume-up-container">
                <div className="volume-bar-item"></div>
                <div className="volume-bar-item"></div>
                <div className="volume-bar-item"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoVolumeInfo;
