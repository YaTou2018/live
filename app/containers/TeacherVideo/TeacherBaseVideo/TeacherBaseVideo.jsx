import React from 'react';
import { connect } from 'react-redux';
import Actions from '@global/actions';
import { YsGlobal } from '@global/handleGlobal';
import { liveRoom, EVENT_TYPE, ROOM_ROLE } from '@global/roomConstants';
import VideoComponenter from '../../../components/video/VideoComponenter';
import AudioComponenter from '../../../components/video/AudioComponenter';
import VideoBackGround from '../../../components/video/VideoBackGround/VideoBackGround';
import MyselfVideoBtn from '../../../components/video/MyselfVideoBtn/MyselfVideoBtn';
import VideoVolumeInfo from '../../../components/video/videoVolumeInfo/VideoVolumeInfo';
import VideoUserPen from '../../../components/video/VideoUserPen/VideoUserPen';
class TeacherBaseVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasvideo: true,
    };
    this.listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
  }

  componentDidMount() {
    liveRoom.addEventListener(EVENT_TYPE.roomUserVideoStateChanged, this.updateStream.bind(this, 'video'), this.listernerBackupid);
    liveRoom.addEventListener(EVENT_TYPE.roomUserAudioStateChanged, this.updateStream.bind(this, 'audio'), this.listernerBackupid);
    liveRoom.addEventListener(EVENT_TYPE.roomUserPropertyChanged, this.handleUserPropertyChanged, this.listernerBackupid);
    this.initState();
  }

  componentWillUnmount() {
    liveRoom.removeBackupListerner(this.listernerBackupid);
  }

  initState() {
    const { teacherUserStream } = this.props;
    const mySelfInfo = liveRoom.getMySelf() || {};
    let userStream = JSON.parse(JSON.stringify(teacherUserStream));
    if (mySelfInfo.role === ROOM_ROLE.TEACHER && !this.props.isClassBegin) {
      userStream = { streamUserId: mySelfInfo.id, videoFlag: mySelfInfo.hasvideo, publishstate: 3 };
    }
    Actions.setTeacherUserStream(userStream);
  }

  isTeacher = userId => {
    const user = liveRoom.getUser(userId);
    return user.role === ROOM_ROLE.TEACHER;
  };

  updateStream = (streamType, streamPublishInfo) => {
    const { teacherUserStream, getPublishstate } = this.props;
    const { type, userId, published, publishstate } = streamPublishInfo.message || {};
    if (type === 'video' && this.isTeacher(userId)) {
      const userStream = Object.assign({}, teacherUserStream, { streamUserId: userId, [`${streamType}Flag`]: published, publishstate });
      Actions.setTeacherUserStream(userStream);
      if (getPublishstate && typeof getPublishstate === 'function') {
        getPublishstate(publishstate);
      }
    }
  };

  /* 处理用户属性改变 */
  handleUserPropertyChanged = data => {
    const { user, message } = data;
    if (user.role === ROOM_ROLE.TEACHER) {
      for (const [key, value] of Object.entries(message)) {
        switch (key) {
          case 'hasvideo': {
            this.setState({
              hasvideo: value,
            });
            const { teacherUserStream } = this.props;
            const mySelfInfo = liveRoom.getMySelf() || {};
            if (mySelfInfo.role === ROOM_ROLE.TEACHER && !this.props.isClassBegin) {
              let userStream = JSON.parse(JSON.stringify(teacherUserStream));
              userStream = { streamUserId: mySelfInfo.id, videoFlag: mySelfInfo.hasvideo, publishstate: 3 };
              Actions.setTeacherUserStream(userStream);
            }
            break;
          }
          default:
            break;
        }
      }
    }
  };

  render() {
    const { hasvideo } = this.state;
    const { isClassBegin, isVideoMirror, teacherUserStream: userStream, pageOrientation, teacherId, onetoone, useVideoinput } = this.props;
    const mySelfInfo = liveRoom.getMySelf() || {};
    const videoConfig = {
      mirror: false,
      loader: false,
      mode: !pageOrientation ? window.YS_VIDEO_MODE.ASPECT_RATIO_COVER : window.YS_VIDEO_MODE.ASPECT_RATIO_CONTAIN,
    };
    const isMobileOnwheat = Boolean(this.props.studentStreamList && this.props.studentStreamList.length > 0 && YsGlobal.isMobile);
    return (
      <>
        <VideoBackGround publishstate={userStream.publishstate} hasVideo={hasvideo} teacherId={teacherId} />
        <VideoComponenter videoStream={userStream} isVideoMirror={isVideoMirror} videoConfig={videoConfig} useVideoinput={useVideoinput} />
        {isClassBegin && !YsGlobal.roomInfo.isLiveRoom && <VideoUserPen userId={userStream.streamUserId} />}
        <AudioComponenter audioStream={userStream} />
        {mySelfInfo.role === ROOM_ROLE.TEACHER && isClassBegin && (
          <MyselfVideoBtn videoFlag={userStream.videoFlag} audioFlag={userStream.audioFlag} onetoone={onetoone} />
        )}
        {((!isClassBegin && mySelfInfo.role === ROOM_ROLE.TEACHER) || (userStream.publishstate !== undefined && userStream.publishstate !== 0)) &&
          !isMobileOnwheat && <VideoVolumeInfo isClassBegin={isClassBegin} audioFlag={userStream.audioFlag} userId={userStream.streamUserId} />}
      </>
    );
  }
}
const mapStateToProps = state => ({
  isClassBegin: state.classroom.isClassBegin,
  roomStatus: state.classroom.roomStatus,
  isVideoMirror: state.common.isVideoMirror,
  teacherUserStream: state.video.teacherUserStream,
  studentStreamList: state.video.studentStreamList,
  teacherId: state.user.teacherId,
  useVideoinput: state.device.useDevices.videoinput,
  pageOrientation: state.classroom.pageOrientation,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TeacherBaseVideo);
