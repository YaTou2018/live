import React from 'react';
import { liveRoom, BASE_WIDTH, EVENT_TYPE, BASE_NUMBER, ROOM_ROLE, VIDEO_DRAG_BOUND_ID } from '@global/roomConstants';
import Actions from '@global/actions';
import { YsGlobal } from '@global/handleGlobal';
import Signalling from '@global/services/SignallingService';
import VideoService from '@global/services/VideoService';

const headerHeight = 0.44;
export const videoResizeHOC = WrappedComponent => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        resizeScale: 1,
      };
      this.lastVideoDragStyle = {}; // 保存拉伸视频前一次的位置百分比
      this.stretchDirection = ''; // 鼠标方向
      this.moveVideoTargetArr = [];
      this.canChangeResize = false;
      this.listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    }

    componentDidMount() {
      const { streamInfo, teacherId, isTeacher } = this.props;
      const id = streamInfo.streamUserId || (isTeacher && teacherId);
      liveRoom.addEventListener(`${id}_mouseMove`, this.videoChangeSize, this.listernerBackupid);
      liveRoom.addEventListener(`${id}_mouseUp`, this.videoMouseUp, this.listernerBackupid);
      liveRoom.addEventListener(EVENT_TYPE.roomPubmsg, this.handlePubmsg, this.listernerBackupid);
      window.addEventListener('resize', this.limitVideoSize);
      this.initState();
    }

    componentDidUpdate(prevProps) {
      const { streamInfo, videoDragInfo, roomStatus } = this.props;
      const { isDrag } = videoDragInfo[streamInfo.streamUserId] || {};
      const { streamInfo: prevStreamInfo, videoDragInfo: prevVideoDragInfo } = prevProps;
      const { isDrag: prevIsDrag } = prevVideoDragInfo[prevStreamInfo.streamUserId] || {};
      if (prevIsDrag !== isDrag && !isDrag) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ resizeScale: 1 });
      }
      if (roomStatus !== prevProps.roomStatus) {
        this.initState();
      }
    }

    componentWillUnmount() {
      liveRoom.removeBackupListerner(this.listernerBackupid);
      window.removeEventListener('resize', this.limitVideoSize);
    }

    handlePubmsg = res => {
      const { name, data } = res.message;
      const { streamInfo } = this.props;
      if (name === 'VideoChangeSize' && data.userId === streamInfo.streamUserId) {
        this.handleMsgVideoChangeSize(data);
      }
    };

    initState() {
      const { streamInfo } = this.props;
      const videoSizeMsg = YsGlobal.msgList.find(item => item.id === `VideoSize_${streamInfo.streamUserId}`);
      if (videoSizeMsg) {
        YsGlobal.msgList = YsGlobal.msgList.filter(item => item.id !== `VideoSize_${streamInfo.streamUserId}`);
        this.handleMsgVideoChangeSize(videoSizeMsg.data);
      }
      const mySelf = liveRoom.getMySelf() || {};
      this.canChangeResize = mySelf.role === ROOM_ROLE.TEACHER || mySelf.role === ROOM_ROLE.ASSISTANT;
    }

    handleMsgVideoChangeSize(msgData) {
      const videoScale = Number(YsGlobal.roomInfo.videowidth) / Number(YsGlobal.roomInfo.videoheight);
      const content = document.getElementById(VIDEO_DRAG_BOUND_ID);
      const { initVideoWidth, initVideoHeight } = VideoService.getInitVideoSize();
      const maxScale = videoScale > content.clientWidth / content.clientHeight ? content.clientWidth / initVideoWidth : content.clientHeight / initVideoHeight;
      const scale = Math.min(Math.max(msgData.scale, 1), maxScale);
      this.setState({
        resizeScale: scale,
      });
    }

    /* 限制视频大小 */
    limitVideoSize = () => {
      // 获取白板区域宽高：
      const content = document.getElementById(VIDEO_DRAG_BOUND_ID);
      const contentW = content.clientWidth;
      const contentH = content.clientHeight;
      const { initVideoWidth, initVideoHeight } = VideoService.getInitVideoSize();
      const { videoWidth, videoHeight } = this.getVideoSize();
      const videoScale = Number(YsGlobal.roomInfo.videowidth) / Number(YsGlobal.roomInfo.videoheight);
      // 不能小于初始值
      let scale = this.state.resizeScale;
      if (videoWidth < initVideoWidth || videoHeight < initVideoHeight) {
        scale = 1;
      }
      // 不能超出白板范围
      if (videoWidth > contentW || videoHeight > contentH) {
        if (videoScale > contentW / contentH) {
          scale = contentW / initVideoWidth;
        }
        scale = contentH / initVideoHeight;
      }
      this.setState({
        resizeScale: scale,
      });
    };

    /* 获取当前视频大小px */
    getVideoSize() {
      const { resizeScale } = this.state;
      const { initVideoWidth, initVideoHeight } = VideoService.getInitVideoSize();
      return {
        videoWidth: initVideoWidth * resizeScale,
        videoHeight: initVideoHeight * resizeScale,
      };
    }

    /* 位置百分比转px */
    percentageToPx = () => {
      const content = document.getElementById(VIDEO_DRAG_BOUND_ID) || {}; // 白板拖拽区域
      const { videoWidth, videoHeight } = this.getVideoSize();
      const { streamInfo, videoDragInfo } = this.props;
      const defalutFontSize = (window.innerWidth / BASE_WIDTH) * BASE_NUMBER;
      const { percentLeft, percentTop } = videoDragInfo[streamInfo.streamUserId] || {};
      const videoLeft = percentLeft * (content.clientWidth - videoWidth);
      const videoTop = percentTop * (content.clientHeight - videoHeight) + headerHeight * defalutFontSize;
      return { videoLeft, videoTop };
    };

    /* 缩放后发送位置 */
    sendDragOfChangeVideoSize = id => {
      const { streamInfo } = this.props;
      const content = document.getElementById(VIDEO_DRAG_BOUND_ID) || {}; // 白板拖拽区域
      const dragEle = document.getElementById(`baseVideoBox_${streamInfo.streamUserId}`) || {}; // 拖拽的元素
      /* 计算位置百分比 */
      let dragEleLeft = dragEle.offsetLeft / (content.clientWidth - dragEle.clientWidth);
      let dragEleTop = (dragEle.offsetTop - headerHeight) / (content.clientHeight - dragEle.clientHeight);
      if (content.clientWidth === dragEle.clientWidth) {
        dragEleLeft = this.lastVideoDragStyle ? this.lastVideoDragStyle.percentLeft : 0;
      } else if (Number.isNaN(dragEleLeft) || dragEleLeft === null) {
        dragEleLeft = 0;
      }
      if (content.clientHeight === dragEle.clientHeight) {
        dragEleTop = this.lastVideoDragStyle ? this.lastVideoDragStyle.percentTop : 0;
      } else if (Number.isNaN(dragEleTop) || dragEleTop === null) {
        dragEleTop = 0;
      }
      const dragEleStyle = {
        userId: id,
        percentTop: dragEleTop,
        percentLeft: dragEleLeft,
        isDrag: true,
      };
      Actions.setVideoDragInfo(dragEleStyle);
      Signalling.sendSignallingVideoDrag(dragEleStyle, id);
    };

    /* 鼠标在白板区抬起时 */
    videoMouseUp = handleData => {
      if (!this.canChangeResize) {
        return;
      }
      const { streamInfo, videoDragInfo } = this.props;
      const { isDrag } = videoDragInfo[streamInfo.streamUserId] || {};
      if (isDrag) {
        const { event } = handleData.message;
        if (YsGlobal.isVideoStretch) {
          const sizeData = {
            userId: streamInfo.streamUserId,
            scale: this.state.resizeScale,
          };
          Signalling.sendSignallingVideoChangeSize(sizeData); // 发送缩放信令
          // this.sendDragOfChangeVideoSize(streamInfo.streamUserId); // 缩放后发送位置信令
          this.lastVideoDragStyle = {
            // 初始化鼠标按下时保存的百分比
            percentLeft: 0,
            percentTop: 0,
          };
          YsGlobal.isVideoStretch = false; // 是否是拉伸
          Actions.setWhiteBoardLay(false);
          event.onmousemove = null;
          event.target.style.cursor = ''; // 在页面上鼠标的样式初始化
          YsGlobal.videoSizeMouseMoveEventName = null; // 在页面上鼠标移动时触发的事件名制空
          YsGlobal.videoSizeMouseUpEventName = null; // 在页面上鼠标抬起时触发的事件名制空
        }
      }
    };

    /* 鼠标在白板区移动时 */
    videoChangeSize = handleData => {
      if (!this.canChangeResize) {
        return;
      }
      const { event } = handleData.message;
      const { streamInfo, videoDragInfo } = this.props;
      const { isDrag } = videoDragInfo[streamInfo.streamUserId] || {};
      if (isDrag && YsGlobal.isVideoStretch) {
        const defalutFontSize = (window.innerWidth / BASE_WIDTH) * BASE_NUMBER;
        const videoScale = Number(YsGlobal.roomInfo.videowidth) / Number(YsGlobal.roomInfo.videoheight);
        const content = document.getElementById(VIDEO_DRAG_BOUND_ID);
        const { initVideoWidth, initVideoHeight } = VideoService.getInitVideoSize();
        const { videoLeft, videoTop } = this.percentageToPx();
        // 获取鼠标相对body的位置：
        const mouseLeft = event.pageX;
        const mouseTop = event.pageY;
        // 改变视频框的大小
        let newScale;
        if (this.stretchDirection === 'w' || this.stretchDirection === 'se') {
          newScale = Math.abs(mouseLeft - videoLeft) / initVideoWidth;
        } else if (this.stretchDirection === 's') {
          newScale = Math.abs(mouseTop - videoTop) / initVideoHeight;
        }
        if (mouseLeft < 0 || mouseLeft < videoLeft || mouseTop < headerHeight * defalutFontSize || mouseTop < videoTop) {
          newScale = 1;
        }
        const maxScale =
          videoScale > content.clientWidth / content.clientHeight ? content.clientWidth / initVideoWidth : content.clientHeight / initVideoHeight;
        this.setState({
          resizeScale: Math.min(Math.max(newScale, 1), maxScale),
        });
      }
    };

    /* 初始化视频上的鼠标样式 */
    initVideoCursorStyle = () => {
      this.moveVideoTargetArr.forEach(moveVideoTarget => {
        // eslint-disable-next-line no-param-reassign
        moveVideoTarget.style.cursor = '';
      });
      this.moveVideoTargetArr = [];
    };

    addMoveTarget(target) {
      if (!this.moveVideoTargetArr.includes(target)) {
        this.moveVideoTargetArr.push(target);
      }
    }

    /* 鼠标在视频框上按下时 */
    mouseDown = () => {
      if (!this.canChangeResize) {
        return;
      }
      const { streamInfo, videoDragInfo } = this.props;
      const { isDrag, percentLeft, percentTop } = videoDragInfo[streamInfo.streamUserId] || {};
      if (isDrag) {
        if (this.stretchDirection) {
          YsGlobal.isVideoStretch = true; // 是否是拉伸状态
          YsGlobal.videoSizeMouseUpEventName = `${streamInfo.streamUserId}_mouseUp`;
          Actions.setWhiteBoardLay(true);
        }
        this.lastVideoDragStyle = {
          // 保存拉伸视频前一次的位置百分比
          percentLeft,
          percentTop,
        };
      }
    };

    /* 鼠标在视频框上移动时 */
    mouseMove = event => {
      if (!this.canChangeResize) {
        return;
      }
      const { streamInfo, videoDragInfo } = this.props;
      const { isDrag } = videoDragInfo[streamInfo.streamUserId] || {};
      const { target } = event;
      if (
        YsGlobal.videoSizeMouseMoveEventName !== `${streamInfo.streamUserId}_mouseMove` &&
        YsGlobal.videoSizeMouseUpEventName !== `${streamInfo.streamUserId}_mouseUp` &&
        !YsGlobal.isVideoStretch &&
        isDrag
      ) {
        YsGlobal.videoSizeMouseMoveEventName = `${streamInfo.streamUserId}_mouseMove`; // 以id作为改变视频大小事件的名字
        YsGlobal.videoSizeMouseUpEventName = `${streamInfo.streamUserId}_mouseUp`;
      }
      if (isDrag) {
        const { videoWidth, videoHeight } = this.getVideoSize();
        const { videoLeft, videoTop } = this.percentageToPx(videoWidth, videoHeight);
        // 获取鼠标相对body的位置：
        const mouseLeft = event.pageX;
        const mouseTop = event.pageY;
        // 改变鼠标的样式
        if (!YsGlobal.isVideoStretch) {
          if (mouseLeft >= videoLeft + videoWidth - 7 && mouseLeft <= videoLeft + videoWidth && mouseTop >= videoTop && mouseTop < videoTop + videoHeight - 7) {
            target.style.cursor = 'w-resize';
            this.stretchDirection = 'w';
            this.addMoveTarget(target);
          } else if (
            mouseTop >= videoTop + videoHeight - 7 &&
            mouseTop <= videoTop + videoHeight &&
            mouseLeft >= videoLeft &&
            mouseLeft < videoLeft + videoWidth - 7
          ) {
            target.style.cursor = 's-resize';
            this.stretchDirection = 's';
            this.addMoveTarget(target);
          } else if (
            mouseTop < videoTop + videoHeight &&
            mouseTop >= videoTop + videoHeight - 7 &&
            mouseLeft < videoLeft + videoWidth &&
            mouseLeft >= videoLeft + videoWidth - 7
          ) {
            target.style.cursor = 'se-resize';
            this.stretchDirection = 'se';
            this.addMoveTarget(target);
          } else {
            this.stretchDirection = '';
            this.initVideoCursorStyle();
          }
        } else {
          this.initVideoCursorStyle();
        }
      }
    };

    render() {
      if (YsGlobal.roomInfo.isLiveRoom || YsGlobal.roomInfo.maxVideo <= 2) {
        return <WrappedComponent {...this.props} />;
      }
      const { streamInfo, videoDragInfo } = this.props;
      const { isDrag } = videoDragInfo[streamInfo.streamUserId] || {};
      const defalutFontSize = (window.innerWidth / BASE_WIDTH) * BASE_NUMBER;
      const { videoWidth, videoHeight } = this.getVideoSize();
      const { resizeScale } = this.state;
      const videoResizeStyle = {
        resizeScale,
        width: `${videoWidth / defalutFontSize}rem`,
        height: `${videoHeight / defalutFontSize}rem`,
      };
      const videoSizeProps = isDrag
        ? {
            videoResizeStyle,
            mouseMove: this.mouseMove,
            mouseDown: this.mouseDown,
          }
        : {};
      return <WrappedComponent {...this.props} videoSizeProps={videoSizeProps} />;
    }
  };
};
