import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { liveRoom, EVENT_TYPE, ROOM_ROLE } from '@global/roomConstants';
import Actions from '@global/actions';
import Signalling from '@global/services/SignallingService';
import VideoService from '@global/services/VideoService';
import { YsGlobal } from '../../global/handleGlobal';
import VideoBackGround from '../../components/video/VideoBackGround/VideoBackGround';
import VideoComponenter from '../../components/video/VideoComponenter';
import AudioComponenter from '../../components/video/AudioComponenter';
import OtherVideoBtn from './OtherVideoBtn/OtherVideoBtn';
import MyselfVideoBtn from '../../components/video/MyselfVideoBtn/MyselfVideoBtn';
import VideoVolumeInfo from '../../components/video/videoVolumeInfo/VideoVolumeInfo';
import VideoUserPen from '../../components/video/VideoUserPen/VideoUserPen';
import Gift from './Gift/Gift';
import { videoDragHOC } from '../../components/video/videoDragHOC';
import { videoResizeHOC } from '../../components/video/videoResizeHOC';

import './studentVideo.scss';

const StudentVideo = props => {
  const {
    streamInfo,
    isClassBegin,
    isVideoMirror,
    studentStreamListLength,
    isVideoLayout,
    doubleVideoId,
    useVideoinput,
    videoDragProps = {},
    videoSizeProps = {},
    onetoone,
  } = props;
  const { video } = YsGlobal.languageInfo;
  const { dragSource, videoDrag = {}, videoDragStyle = {} } = videoDragProps;
  const { mouseMove, mouseDown, videoResizeStyle = {} } = videoSizeProps;
  const mySelfInfo = liveRoom.getMySelf() || {};
  const user = liveRoom.getUser(streamInfo.streamUserId) || {};
  const [draw, setDraw] = useState(user.candraw);
  const [isInBackGround, setIsInBackGround] = useState(user.isInBackGround || false);
  const [giftnumber, setGiftNumber] = useState(user.giftnumber || 0);
  const scale = Number(YsGlobal.roomInfo.videowidth) / Number(YsGlobal.roomInfo.videoheight);

  useEffect(() => {
    return () => {
      if (doubleVideoId === streamInfo.streamUserId) {
        // 视频全屏还原
        Actions.setDoubleVideoId('');
        Signalling.sendSignallingDoubleClickVideo({}, undefined, true);
      }
    };
  }, []);

  useEffect(() => {
    /* 处理用户属性改变 */
    const handleUserPropertyChanged = data => {
      const { user: changeUser, message } = data;
      if (changeUser.id === streamInfo.streamUserId) {
        for (const [key, value] of Object.entries(message)) {
          switch (key) {
            case 'candraw':
              setDraw(value);
              break;
            case 'giftnumber':
              setGiftNumber(value);
              break;
            case 'isInBackGround':
              setIsInBackGround(!!value);
              break;
            default:
              break;
          }
        }
      }
    };
    const listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    liveRoom.addEventListener(EVENT_TYPE.roomUserPropertyChanged, handleUserPropertyChanged, listernerBackupid);
    return () => {
      liveRoom.removeBackupListerner(listernerBackupid);
    };
  }, [streamInfo.streamUserId]);

  const doubleClickVideo = () => {
    const canDoubleClick = isClassBegin && (mySelfInfo.role === ROOM_ROLE.TEACHER || mySelfInfo.role === ROOM_ROLE.ASSISTANT);
    if (isVideoLayout || !canDoubleClick || onetoone) {
      return;
    }
    VideoService.handleDoubleClickVideo(streamInfo.streamUserId, videoDrag.isDrag);
  };

  const setVideoStyle = () => {
    if (isVideoLayout) {
      // 视频布局时，样式由父元素类名控制
      return {};
    }
    if (doubleVideoId === streamInfo.streamUserId) {
      // 双击视频全屏时，计算视频高度
      return VideoService.setDoubleVideoHeight(doubleVideoId, studentStreamListLength);
    }
    return Object.assign({}, videoDragStyle, videoResizeStyle);
  };

  const hasOtherVideoBtn = mySelfInfo.role === ROOM_ROLE.TEACHER || mySelfInfo.role === ROOM_ROLE.ASSISTANT;
  const scaleClassName = Math.abs(scale - 4 / 3) < Math.abs(scale - 16 / 9) ? 'four-to-three' : 'sixteen-to-nine';
  const doubleVideoClassName = doubleVideoId === streamInfo.streamUserId ? `full-screen-video` : '';

  return (
    <div
      id={`baseVideoBox_${streamInfo.streamUserId}`}
      ref={dragSource}
      onMouseMove={mouseMove}
      onMouseDown={mouseDown}
      onDoubleClick={doubleClickVideo}
      className={`student-video video-Layout ${doubleVideoClassName}`}
      style={setVideoStyle()}
    >
      <div className={`base-video ${scaleClassName}`}>
        {isInBackGround && (
          <div className="isInBackGround">
            <i>!</i> {video.pressedHome}
          </div>
        )}
        <VideoBackGround publishstate={streamInfo.publishstate} hasVideo />
        <VideoComponenter videoStream={streamInfo} isVideoMirror={isVideoMirror} useVideoinput={useVideoinput} />
        {isClassBegin && <VideoUserPen userId={streamInfo.streamUserId} />}
        <AudioComponenter audioStream={streamInfo} />
        {YsGlobal.roomInfo.isClassRoom && <Gift giftnumber={giftnumber} />}
        {mySelfInfo.id === streamInfo.streamUserId && !YsGlobal.roomInfo.isLiveRoom && (
          <MyselfVideoBtn videoFlag={streamInfo.videoFlag} audioFlag={streamInfo.audioFlag} onetoone={onetoone} />
        )}
        {hasOtherVideoBtn && <OtherVideoBtn streamInfo={streamInfo} draw={draw} hasVideoRestoreBtn={videoDrag.isDrag} onetoone={onetoone} />}
        <VideoVolumeInfo isClassBegin={isClassBegin} audioFlag={streamInfo.audioFlag} userId={streamInfo.streamUserId} />
      </div>
    </div>
  );
};
const mapStateToProps = state => ({
  isClassBegin: state.classroom.isClassBegin,
  isVideoMirror: state.common.isVideoMirror,
  videoDragInfo: state.video.videoDragInfo,
  isVideoLayout: state.classroom.isVideoLayout,
  studentStreamListLength: state.video.studentStreamList.length,
  doubleVideoId: state.video.doubleVideoId,
  useVideoinput: state.device.useDevices.videoinput,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(videoResizeHOC(videoDragHOC(StudentVideo)));
