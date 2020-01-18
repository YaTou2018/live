import { liveRoom, BASE_WIDTH, BASE_NUMBER, ROOM_TYPE } from '@global/roomConstants';
import { getUrlParams } from '../utils/url';
import { getLanguageName, getLanguage } from '../utils/utils';

const YsGlobal = {};
YsGlobal.playback = /index.html#\/(replay|playback)/g.test(window.location.href); // 是否回放
YsGlobal.loginType = Number(getUrlParams('logintype'));
YsGlobal.joinUrl = window.location.href;
YsGlobal.entryUserId = getUrlParams('entryUserId');
YsGlobal.ysVersion = '2.2.0.12';
YsGlobal.updateTime = '2020011719';
YsGlobal.languageName = getLanguageName();
YsGlobal.languageInfo = {}; // YsGlobal.languageName === 'chinese' ? chineseLanguage : englishLanguage;
YsGlobal.connectServerTime = ''; // 房间连接时的服务器时间
YsGlobal.roomConfigItem = {}; // 房间配置
YsGlobal.roomInfo = {}; // 房间配置
YsGlobal.isMobile = navigator.userAgent.match(/AppleWebKit.*Mobile.*/);
YsGlobal.msgList = [];
YsGlobal.videoSizeMouseMoveEventName = null; // 鼠标移动触发事件的名字（视频拉伸中用到）
YsGlobal.videoSizeMouseUpEventName = null; // 鼠标抬起触发事件的名字（视频拉伸中用到）
YsGlobal.isVideoStretch = false; // 是否是拉伸状态
YsGlobal.isCheckVideoDevice = true; // 是否检测视频设备
YsGlobal.isCheckAudioOutput = true; // 是否检测扬声器设备
YsGlobal.isWheatCheckEquipment = true; // 上麦前检测设备
YsGlobal.isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent); // 是否Safari浏览器
YsGlobal.chatList = [];
YsGlobal.currentFile = {
  fileId: 0,
  currentPage: 1,
}; // 当前显示的课件
YsGlobal.serviceInfo = {
  protocol: 'https',
  host: 'api.roadofcloud.com',
  port: 443,
  webRequest: 'https://api.roadofcloud.com:443',
};

(() => {
  const initRoomInfo = () => {
    document.documentElement.style.fontSize = `${(window.innerWidth / BASE_WIDTH) * BASE_NUMBER}px`;
    document.documentElement.setAttribute('data-version', YsGlobal.ysVersion);
    document.documentElement.setAttribute('data-language', YsGlobal.languageName);
    document.documentElement.setAttribute('data-updateTime', YsGlobal.updateTime);
    if (YsGlobal.playback) {
      document.documentElement.style.pointerEvents = 'none';
    }
    const roomType = parseInt(getUrlParams('roomtype'), 10);
    if (roomType === ROOM_TYPE.CLASS_ROOM) {
      YsGlobal.roomInfo.isClassRoom = true;
    } else if (roomType === ROOM_TYPE.LIVE_ROOM) {
      YsGlobal.isCheckVideoDevice = YsGlobal.loginType !== 2;
      YsGlobal.roomInfo.isLiveRoom = true;
    } else if (roomType === ROOM_TYPE.MEETING_ROOM) {
      YsGlobal.roomInfo.isMettingRoom = true;
    }
    YsGlobal.isCheckAudioOutput = !YsGlobal.isSafari;
    YsGlobal.languageInfo = getLanguage(YsGlobal.languageName);
  };
  initRoomInfo();

  const handleWindowResize = () => {
    document.documentElement.style.fontSize = `${(window.innerWidth / BASE_WIDTH) * BASE_NUMBER}px`;
    liveRoom.dispatchEvent({ type: 'window-resize' });
  };
  window.removeEventListener('resize', handleWindowResize);
  window.addEventListener('resize', handleWindowResize);
})();

window.YsGlobal = YsGlobal;
export { YsGlobal };
