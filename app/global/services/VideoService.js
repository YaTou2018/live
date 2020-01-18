import store from '@app/store';
import Signalling from '@global/services/SignallingService';
import Actions from '@global/actions';
import { BASE_WIDTH, BASE_NUMBER, VIDEO_DRAG_BOUND_ID, WB_CONTAINER_ID } from '@global/roomConstants';
import { YsGlobal } from '../handleGlobal';

const headerHeight = 0.44;
class VideoService {
  constructor() {
    this.instance = null;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new VideoService();
    }
    return this.instance;
  }

  /* 设置双击视频时的高度 */
  setDoubleVideoHeight = (doubleVideoId, bottomStreamListLength) => {
    const scale = Number(YsGlobal.roomInfo.videowidth) / Number(YsGlobal.roomInfo.videoheight);
    const { teacherId } = store.getState().user;
    const bottomVideoNum = doubleVideoId && doubleVideoId !== teacherId ? bottomStreamListLength - 1 : bottomStreamListLength;
    const { maxVideo } = YsGlobal.roomInfo;
    if (YsGlobal.isMobile) {
      const swiperBox = document.getElementById(WB_CONTAINER_ID);
      if (swiperBox && swiperBox.getBoundingClientRect) {
        return {
          height: `${swiperBox.clientHeight}px`,
          top: `${swiperBox.getBoundingClientRect().top}px`,
        };
      }
    }
    if (bottomVideoNum === 0 || maxVideo === 2) {
      return { height: `calc(100vh - ${headerHeight}rem)` };
    }
    if (bottomVideoNum <= 6) {
      return { height: `calc(100vh - ${headerHeight}rem - (((100vw - 4.22rem) / 6 - 0.05rem) / ${scale} + 0.1rem))` };
    }
    if (bottomVideoNum > 6 && bottomVideoNum <= 8) {
      // 高度 = 总高度 - 头部高度 - （一个视频高度 + 0.1rem的margin）
      return { height: `calc(100vh - ${headerHeight}rem - (((100vw - 4.22rem) / ${bottomVideoNum} - 0.05rem) / ${scale} + 0.1rem))` };
    }
    // 高度 = 总高度 - 头部高度 - （两个视频高度 + 0.15rem的margin）
    return { height: `calc(100vh - ${headerHeight}rem - ((((100vw - 4.22rem) / 8 - 0.05rem) / ${scale}) * 2 + 0.15rem))` };
  };

  /*
   * 处理视频双击
   * streamUserId: 双击的视频的用户id
   * videoIsDrag: 这个视频是否拖拽出来了
   * */
  handleDoubleClickVideo = (streamUserId, videoIsDrag) => {
    const { doubleVideoId, videoDragInfo } = store.getState().video;
    if (videoIsDrag) {
      // 拖拽还原
      Actions.deleteVideoDragInfo(streamUserId);
      Signalling.sendSignallingVideoDrag({}, streamUserId, true);
      return;
    }
    if (doubleVideoId === streamUserId) {
      // 视频双击全屏还原
      Actions.setDoubleVideoId('');
      Signalling.sendSignallingDoubleClickVideo({}, undefined, true);
    } else {
      for (const value of Object.values(videoDragInfo)) {
        // 所有视频拖拽还原
        Actions.deleteVideoDragInfo(value.userId);
        Signalling.sendSignallingVideoDrag({}, value.userId, true);
      }
      Actions.setDoubleVideoId(streamUserId);
      const signallData = {
        doubleId: streamUserId,
      };
      Signalling.sendSignallingDoubleClickVideo(signallData, streamUserId);
    }
  };

  getInitVideoSize = () => {
    const { studentStreamList } = store.getState().video;
    const defalutFontSize = (window.innerWidth / BASE_WIDTH) * BASE_NUMBER;
    const videoScale = Number(YsGlobal.roomInfo.videowidth) / Number(YsGlobal.roomInfo.videoheight);
    const content = document.getElementById(VIDEO_DRAG_BOUND_ID) || {}; // 白板拖拽区域
    const contentW = content.clientWidth;
    const initVideoWidth = YsGlobal.isMobile ? contentW / 4 : contentW / Math.min(Math.max(studentStreamList.length, 6), 8) - 0.05 * defalutFontSize;
    const initVideoHeight = initVideoWidth / videoScale;
    return {
      initVideoWidth,
      initVideoHeight,
    };
  };
}

export default VideoService.getInstance();
