import React, { useState, useEffect, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import { liveRoom, PUBLISH_STATE } from '@global/roomConstants';
import DeskTopSharing from '@containers/ShareSmart/deskTopSharing/DeskTopSharing'; // 共享
import ApplyForWheat from '@containers/Chat/ChatInputBox/ApplyForWheat/ApplyForWheat';
import StudentVideoList from '@containers/StudentVideoList/StudentVideoList';
import BarrageComponent from '@containers/BarrageComponent/BarrageComponent';
import TeacherBaseVideo from '@containers/TeacherVideo/TeacherBaseVideo/TeacherBaseVideo';
import BtnMaskMobile from './BtnMaskMobile/BtnMaskMobile';
import { YsGlobal } from '../../../global/handleGlobal';

import './teacherVideoMobile.scss';

const { maxVideo } = YsGlobal.roomInfo;

const TeacherVideoMobile = props => {
  const { mp4Status, studentStreamListLength, pageOrientation, videoDragInfo, teacherId } = props;
  const [publishstate, setPublishstate] = useState(0);
  const [isBarrage, setIsBarrage] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [hasBtnMaskMobile, setHasBtnMaskMobile] = useState(false);
  const changeBtnMaskTimer = useRef(null);
  const scale = Number(YsGlobal.roomInfo.videowidth) / Number(YsGlobal.roomInfo.videoheight);
  const scaleClassName = Math.abs(scale - 4 / 3) < Math.abs(scale - 16 / 9) ? 'four-to-three' : 'sixteen-to-nine';

  useEffect(() => {
    if (pageOrientation === 0) {
      setIsFullScreen(false);
    } else if (pageOrientation === 90) {
      setIsFullScreen(true);
    } else if (pageOrientation === -90) {
      setIsFullScreen(true);
    }
  }, [pageOrientation]);

  useEffect(() => {
    if (mp4Status !== 'end') {
      setIsFullScreen(false);
    }
  }, [mp4Status]);

  const getPublishstate = useCallback(value => {
    setPublishstate(value);
  }, []);

  const switchBarrage = useCallback(() => {
    setIsBarrage(!isBarrage);
  }, [isBarrage]);

  const switchFullScreen = useCallback(() => {
    setIsFullScreen(!isFullScreen);
  }, [isFullScreen]);

  const videoBoxClick = () => {
    if (publishstate === PUBLISH_STATE.NONE || pageOrientation === 0) {
      return;
    }
    setHasBtnMaskMobile(!hasBtnMaskMobile);
    clearTimeout(changeBtnMaskTimer.current);
    if (!hasBtnMaskMobile) {
      changeBtnMaskTimer.current = setTimeout(() => {
        setHasBtnMaskMobile(false);
        clearTimeout(changeBtnMaskTimer.current);
      }, 5000);
    }
  };
  const setVideoNum = () => {
    const videoDragLen = Object.keys(videoDragInfo).filter(item => item !== teacherId).length;
    const videolength = studentStreamListLength - videoDragLen;
    if (videolength > 4 && videolength <= 8) {
      return 'two-rows';
    }
    if (videolength > 8 && videolength <= 12) {
      return 'three-rows';
    }
    return '';
  };

  const fullScreen = isFullScreen
    ? {
        width: `${window.innerHeight}px`,
      }
    : {};
  const rotateClassName = pageOrientation === 0 ? '' : 'rotate-90';
  const { isLiveRoom } = YsGlobal.roomInfo;
  return (
    <div id="teacherPlaceholderBg" className={`placeholder-bg ${scaleClassName} ${setVideoNum()}`}>
      <div
        id="teacher-video-box"
        onClick={videoBoxClick}
        className={`mobile teacher-video-box ${isFullScreen ? 'full-Screen' : ''} ${rotateClassName} ${
          studentStreamListLength > 2 && !isFullScreen ? 'overstep-two' : ''
        }`}
        style={fullScreen}
      >
        {props.mp3Status !== 'end' && <div className={`mp3Icon ${props.mp3Status}icon`} />}

        {YsGlobal.isMobile && isLiveRoom && <ApplyForWheat />}
        <TeacherBaseVideo getPublishstate={getPublishstate} />
        <DeskTopSharing isFullScreen={isFullScreen} />
        {publishstate !== PUBLISH_STATE.NONE && (
          <>
            {isFullScreen && isBarrage && <BarrageComponent />}
            <BtnMaskMobile
              hasBtnMaskMobile={hasBtnMaskMobile}
              isBarrage={isBarrage}
              switchBarrage={switchBarrage}
              isFullScreen={isFullScreen}
              switchFullScreen={switchFullScreen}
            />
          </>
        )}
        {maxVideo !== 2 && <StudentVideoList />}
      </div>
    </div>
  );
};
const mapStateToProps = state => ({
  mp4Status: state.whiteboard.mp4Status,
  mp3Status: state.whiteboard.mp3Status,
  studentStreamListLength: state.video.studentStreamList.length,
  pageOrientation: state.classroom.pageOrientation,
  videoDragInfo: state.video.videoDragInfo,
  teacherId: state.user.teacherId,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TeacherVideoMobile);
