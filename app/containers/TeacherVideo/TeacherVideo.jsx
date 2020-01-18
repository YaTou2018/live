import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Actions from '@global/actions';
import { liveRoom, ROOM_ROLE, EVENT_TYPE } from '@global/roomConstants';
import VideoService from '@global/services/VideoService';
import TeacherBaseVideo from './TeacherBaseVideo/TeacherBaseVideo';
import { videoDragHOC } from '../../components/video/videoDragHOC';
import { videoResizeHOC } from '../../components/video/videoResizeHOC';
import './teacherVideo.scss';

import { YsGlobal } from '../../global/handleGlobal';

const TeacherVideo = props => {
  const {
    isVideoLayout,
    doubleVideoId,
    isClassBegin,
    studentStreamListLength,
    roomStatus,
    teacherId,
    onetoone,
    isExchangeOne2oneLayout,
    isFoldedOne2oneLayout,
    videoDragProps = {},
    videoSizeProps = {},
  } = props;
  const scale = Number(YsGlobal.roomInfo.videowidth) / Number(YsGlobal.roomInfo.videoheight);
  const scaleClassName = Math.abs(scale - 4 / 3) < Math.abs(scale - 16 / 9) ? 'four-to-three' : 'sixteen-to-nine';
  const mySelf = liveRoom.getMySelf() || {};
  const { dragSource, videoDrag = {}, videoDragStyle = {} } = videoDragProps;
  const { mouseMove, mouseDown, videoResizeStyle = {} } = videoSizeProps;

  const doubleClickVideo = () => {
    const canDoubleClick = isClassBegin && (mySelf.role === ROOM_ROLE.TEACHER || mySelf.role === ROOM_ROLE.ASSISTANT);
    if (isVideoLayout || !canDoubleClick || !teacherId || onetoone) {
      return;
    }
    VideoService.handleDoubleClickVideo(teacherId, videoDrag.isDrag);
  };

  const setVideoStyle = () => {
    if (isVideoLayout) {
      // 视频布局时，样式由父元素类名控制
      return {};
    }
    if (doubleVideoId && doubleVideoId === teacherId) {
      // 双击视频全屏时，计算视频高度
      return VideoService.setDoubleVideoHeight(doubleVideoId, studentStreamListLength);
    }
    return Object.assign({}, videoDragStyle, videoResizeStyle);
  };

  const toggleFoldVideo = () => {
    Actions.exchangeOne2oneVideoLayout(isExchangeOne2oneLayout, !isFoldedOne2oneLayout);
  };

  const doubleVideoClassName = doubleVideoId && doubleVideoId === teacherId ? `full-screen-video` : '';
  const isTopRightPosition = onetoone === 'nested' && !isVideoLayout && isExchangeOne2oneLayout;
  return (
    <div
      className={`placeholder-bg ${scaleClassName} ${isTopRightPosition ? 'topright' : ''} ${
        isTopRightPosition && isFoldedOne2oneLayout ? 'topright-folded' : ''
      }`}
    >
      <div
        id={`baseVideoBox_${teacherId}`}
        ref={dragSource}
        onMouseMove={mouseMove}
        onMouseDown={mouseDown}
        onDoubleClick={doubleClickVideo}
        className={`teacher-video-box ${scaleClassName} ${doubleVideoClassName}`}
        style={setVideoStyle()}
      >
        <TeacherBaseVideo onetoone={onetoone} />
      </div>
      {onetoone === 'nested' && !isVideoLayout && studentStreamListLength === 1 && isExchangeOne2oneLayout && (
        <div className="foldedvideoBtn-box">
          <span className={`flodedvideoBtn ${isFoldedOne2oneLayout ? 'folded' : 'unfold'}`} onClick={toggleFoldVideo.bind(this)}></span>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  isClassBegin: state.classroom.isClassBegin,
  doubleVideoId: state.video.doubleVideoId,
  videoDragInfo: state.video.videoDragInfo,
  streamInfo: state.video.teacherUserStream,
  isVideoLayout: state.classroom.isVideoLayout,
  roomStatus: state.classroom.roomStatus,
  studentStreamListLength: state.video.studentStreamList.length,
  teacherId: state.user.teacherId,
  isExchangeOne2oneLayout: state.classroom.isExchangeOne2oneLayout,
  isFoldedOne2oneLayout: state.classroom.isFoldedOne2oneLayout,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(videoResizeHOC(videoDragHOC(TeacherVideo)));
