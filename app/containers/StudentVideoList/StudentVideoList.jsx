import React from 'react';
import { connect } from 'react-redux';
import { liveRoom, EVENT_TYPE, ROOM_ROLE, PUBLISH_STATE } from '@global/roomConstants';
// import { YsGlobal } from '../../global/handleGlobal';
import Actions from '@global/actions';
import StudentVideo from './StudentVideo';
import TeacherVideo from '../TeacherVideo/TeacherVideo';
import './studentVideoList.scss';
import { YsGlobal } from '../../global/handleGlobal';

const headerHeight = 0.44;
class StudentVideoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHeightCover: false,
    };
    this.listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
  }

  componentDidMount() {
    liveRoom.addEventListener(EVENT_TYPE.roomUserVideoStateChanged, this.updateStreamList.bind(this, 'video'), this.listernerBackupid);
    liveRoom.addEventListener(EVENT_TYPE.roomUserAudioStateChanged, this.updateStreamList.bind(this, 'audio'), this.listernerBackupid);
    liveRoom.addEventListener(EVENT_TYPE.roomParticipantLeave, this.handleUserLeave, this.listernerBackupid);
    liveRoom.addEventListener(EVENT_TYPE.roomUserPropertyChanged, this.handleUserPropertyChanged, this.listernerBackupid);
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();
  }

  componentDidUpdate(prevProps) {
    const { studentStreamList, teacherId } = this.props;
    const { isVideoLayout } = this.props;
    if (
      isVideoLayout &&
      (prevProps.isVideoLayout !== isVideoLayout || studentStreamList.length !== prevProps.studentStreamList.length || teacherId !== prevProps.teacherId)
    ) {
      this.handleWindowResize();
    }
  }

  componentWillUnmount() {
    liveRoom.removeBackupListerner(this.listernerBackupid);
    window.removeEventListener('resize', this.handleWindowResize);
  }

  isTeacher = userId => {
    const user = liveRoom.getUser(userId);
    return user.role === ROOM_ROLE.TEACHER;
  };

  updateStreamList = (streamType, streamPublishInfo) => {
    const { type, userId, published, publishstate } = streamPublishInfo.message || {};
    if (type === 'video' && !this.isTeacher(userId)) {
      const addStreamInfo = { streamUserId: userId, [`${streamType}Flag`]: published, publishstate };
      let list = JSON.parse(JSON.stringify(this.props.studentStreamList));
      const hasStream = list.find(item => item.streamUserId === userId);
      if (hasStream) {
        Object.assign(hasStream, addStreamInfo);
      } else {
        list = [...list, addStreamInfo];
      }
      list = list.filter(item => item.publishstate !== PUBLISH_STATE.NONE);
      Actions.setStudentStreamList(list);
    }
  };

  /* 处理用户属性改变 */
  handleUserPropertyChanged = data => {
    const { user, message } = data;
    for (const [key, value] of Object.entries(message)) {
      switch (key) {
        case 'publishstate':
          if (value === 0) {
            const list = JSON.parse(JSON.stringify(this.props.studentStreamList));
            Actions.setStudentStreamList(list.filter(item => item.streamUserId !== user.id));
          }
          break;
        default:
          break;
      }
    }
  };

  handleUserLeave = handleData => {
    const { user } = handleData;
    const list = JSON.parse(JSON.stringify(this.props.studentStreamList));
    Actions.setStudentStreamList(list.filter(item => item.streamUserId !== user.id));
    Actions.exchangeOne2oneVideoLayout(false);
  };

  createVideo = () => {
    const { videoDragInfo, studentStreamList, onetoone } = this.props;
    const newStudentStreamList = studentStreamList.sort((a, b) => {
      return a.streamUserId.localeCompare(b.streamUserId);
    });
    return newStudentStreamList.map(streamInfo => {
      return <StudentVideo key={streamInfo.streamUserId} streamInfo={streamInfo} videoDragInfo={videoDragInfo} onetoone={onetoone} />;
    });
  };

  setVideoNum = () => {
    const { studentStreamList, teacherId } = this.props;
    return teacherId ? `video-width-${studentStreamList.length + 1}` : `video-width-${studentStreamList.length}`;
  };

  handleWindowResize = () => {
    const { studentStreamList } = this.props;
    if (!this.props.isVideoLayout) {
      return;
    }
    let videoScale = Number(YsGlobal.roomInfo.videowidth) / Number(YsGlobal.roomInfo.videoheight);
    // 视频区宽高 = 页面宽高 - padding
    const videoWidth = YsGlobal.isMobile ? window.innerWidth : window.innerWidth - (1.16 * 2 * window.innerWidth * 100) / 1920;
    const videoHeight = YsGlobal.isMobile ? window.innerHeight : window.innerHeight - (headerHeight * window.innerWidth * 100) / 1920;
    const layoutVideolength = this.props.teacherId ? studentStreamList.length + 1 : studentStreamList.length;
    if (layoutVideolength === 5 || layoutVideolength === 6) {
      videoScale = (videoScale * 3) / 2;
    } else if (layoutVideolength >= 10 && layoutVideolength <= 12) {
      videoScale = (videoScale * 4) / 3;
    }
    if (videoWidth / videoHeight > videoScale) {
      this.setState({ isHeightCover: true });
    } else {
      this.setState({ isHeightCover: false });
    }
  };

  toggleFoldVideo() {
    Actions.exchangeOne2oneVideoLayout(this.props.isExchangeOne2oneLayout, !this.props.isFoldedOne2oneLayout);
  }

  render() {
    const { isHeightCover } = this.state;
    const { isVideoLayout, studentStreamList, onetoone, isExchangeOne2oneLayout, isFoldedOne2oneLayout } = this.props;
    const scale = Number(YsGlobal.roomInfo.videowidth) / Number(YsGlobal.roomInfo.videoheight);
    const scaleClassName = Math.abs(scale - 4 / 3) < Math.abs(scale - 16 / 9) ? 'four-to-three' : 'sixteen-to-nine';
    const isTopRightPosition = onetoone === 'nested' && !isVideoLayout && !isExchangeOne2oneLayout;
    return (
      <div
        className={`student-video-list 
        ${studentStreamList.length > 8 ? 'two-rows' : ''} 
        ${isVideoLayout ? 'video-Layout-box' : ''} 
        ${this.setVideoNum()} 
        ${isHeightCover ? 'height-cover' : ''}
        ${isTopRightPosition ? 'topright' : ''}
        ${isTopRightPosition && isFoldedOne2oneLayout ? 'topright-folded' : ''}
        ${scaleClassName}`}
      >
        {isVideoLayout && this.props.teacherId && (
          <div className="teacher-video video-Layout">
            <TeacherVideo />
          </div>
        )}
        {this.createVideo()}
        {onetoone === 'nested' && !isExchangeOne2oneLayout && !isVideoLayout && this.props.studentStreamList.length === 1 && (
          <div className="foldedvideoBtn-box">
            <span className={`flodedvideoBtn ${isFoldedOne2oneLayout ? 'folded' : 'unfold'}`} onClick={this.toggleFoldVideo.bind(this)}></span>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isClassBegin: state.classroom.isClassBegin,
  roomStatus: state.classroom.roomStatus,
  isVideoLayout: state.classroom.isVideoLayout,
  videoDragInfo: state.video.videoDragInfo,
  studentStreamList: state.video.studentStreamList,
  isExchangeOne2oneLayout: state.classroom.isExchangeOne2oneLayout,
  isFoldedOne2oneLayout: state.classroom.isFoldedOne2oneLayout,
  teacherId: state.user.teacherId,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(StudentVideoList);
