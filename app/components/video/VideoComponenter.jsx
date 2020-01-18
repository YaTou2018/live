import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { liveRoom } from '@global/roomConstants';
import './videoComponent.scss';

const CHAT_VIDEO = 'chatVideo';
const STREAM_TYPE = 'video';
const VideoComponenter = props => {
  const { videoStream, videoConfig, isVideoMirror, useVideoinput } = props;
  const { streamUserId, videoFlag } = videoStream;
  const { isMirror } = videoConfig;

  useEffect(() => {
    if (streamUserId) {
      if (videoFlag) {
        liveRoom.playVideo(streamUserId, `${CHAT_VIDEO}_${streamUserId}`, videoConfig);
      } else {
        liveRoom.unplayVideo(streamUserId);
      }
    }
    return () => {
      if (streamUserId) {
        liveRoom.unplayVideo(streamUserId);
      }
    };
  }, [streamUserId, videoConfig.mode, videoFlag, useVideoinput]);

  useEffect(() => {
    liveRoom.updateVideoPlayerOptions({ mirror: isMirror }, streamUserId, undefined, STREAM_TYPE);
  }, [isMirror, streamUserId]);

  return <div className={`chat-video ${isVideoMirror ? 'video-mirror' : ''}`} id={`${CHAT_VIDEO}_${streamUserId}`} />;
};
VideoComponenter.propTypes = {
  videoStream: PropTypes.object, // 用户流信息
  /* 视频配置 type:object
   mirror: 是否开启视频镜像，type:bool，默认：false
   loader: 未加载到视频数据时是否显示‘加载中’样式，type:bool，默认：true
   mode: 等比例显示或被裁剪，type:number,默认：YS_VIDEO_MODE.ASPECT_RATIO_CONTAIN（不裁剪）
   * */
  videoConfig: PropTypes.object, // 视频配置
};
VideoComponenter.defaultProps = {
  videoConfig: {
    mirror: false,
    loader: false,
    mode: window.YS_VIDEO_MODE.ASPECT_RATIO_COVER,
  },
};
export default VideoComponenter;
