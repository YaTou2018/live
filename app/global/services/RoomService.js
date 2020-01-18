import { YS, liveRoom, ROOM_STATE, ROOM_ROLE, L, ROOM_TYPE } from '@global/roomConstants';
import Actions from '@global/actions';
import { getDeviceType } from '@utils/ysUtils';
// import { uuidv3 } from '@utils/uuid';
import WhiteboardService from '@global/services/WhiteboardService';
import FetchService from '@global/services/FetchService';
import { YsGlobal } from '@global/handleGlobal';
import Signalling from '@global/services/SignallingService';
import store from '@app/store';
import { getUrlParams } from '../../utils/url';
import UserService from './UserService';

class RoomService {
  constructor() {
    this.instance = null;
    const whiteboardManager = new window.YSWhiteBoardManager(undefined, undefined, true);
    WhiteboardService.setYsWhiteBoardManager(whiteboardManager);
    liveRoom.registerRoomWhiteBoardDelegate(whiteboardManager);
    this.roomEndNoticeTimer = '';
    this.teacherLeaveTimer = '';
  }

  // room实例
  static getInstance() {
    if (!this.instance) {
      if (YS.Initialize) {
        YS.Initialize();
      }
      this.instance = new RoomService();
    }
    return this.instance;
  }

  // 房间初始化
  initRoom() {
    liveRoom.init(
      'asd65EQqdsVthjKc',
      () => {
        // success
        // this.initWhiteBoard()
        if (YsGlobal.playback) {
          this.joinRoomPlayback();
        } else {
          this.joinRoom();
        }
      },
      undefined,
      !(YsGlobal.playback || YsGlobal.loginType === 88 || YsGlobal.isMobile || !YsGlobal.isCheckVideoDevice), // isCheckDevice
      {
        isGetFileList: !YsGlobal.playback,
        autoSubscribeAV: true,
        isInnerVersions: true,
        ys_invalidappkey: true,
        useHttpProtocol: YsGlobal.loginType === 88, // 是否使用http
        useServerScreenRecording: YsGlobal.loginType === 88, // 是否开启离屏录制
        safariOnlySubscibe: YsGlobal.isSafari && YsGlobal.loginType === 2 && YsGlobal.roomInfo.isLiveRoom,
      },
    );
  }

  // 房间卸载
  uninit() {
    liveRoom.uninit(
      // eslint-disable-next-line no-console
      res => console.log('uninit success', res),
      // eslint-disable-next-line no-console
      err => console.log('uninit error', err),
    );
  }

  // 进入房间
  joinRoom() {
    const { host, port } = YsGlobal.serviceInfo;
    const decodeUrl = decodeURIComponent(YsGlobal.joinUrl);
    const urlIndex = decodeUrl.indexOf('?');
    const checkroomParamsUrl = decodeUrl.substring(urlIndex + 1);
    const userOptions = {
      devicetype: getDeviceType(),
      version: YsGlobal.ysVersion,
      disablechat: false,
      candraw: false,
      giftnumber: 0,
      primaryColor: '#FF0000', // 视频右上角的画笔颜色
    };
    liveRoom.joinroom(
      host,
      port,
      null,
      YsGlobal.entryUserId,
      {
        checkroomParamsUrl,
      }, // roomInfo
      userOptions, // 用户自定义属性
      // '39.105.20.202', // 测试ip
      // 8889, // 测试端口
    );
  }

  /* 回放进入房间 */
  joinRoomPlayback() {
    const { host, port } = YsGlobal.serviceInfo;
    const path = getUrlParams('path');
    const playbackParams = {
      roomtype: getUrlParams('roomtype'),
      serial: getUrlParams('serial'),
      recordfilepath: `http://${/\//g.test(path.charAt(path.length - 1)) ? path : `${path}/`}`,
      domain: getUrlParams('domain'),
      host: getUrlParams('host'),
    };
    liveRoom.joinPlaybackRoom(host, port, playbackParams);
  }

  /* 处理上课后逻辑 */
  handleBeginClass(handleMsg) {
    const { isMettingRoom } = YsGlobal.roomInfo;
    const { ts } = handleMsg;
    Actions.beginClass(ts * 1000);
    Actions.setIsClassBegin(true);
    if (isMettingRoom) return;
    UserService.autoStartAV();
  }

  /* 处理下课后逻辑 */
  handleEndClass(message) {
    const { fromID } = message || {};
    const mySelf = liveRoom.getMySelf();
    Actions.beginClass('');
    Actions.setRoomStatus(ROOM_STATE.END);
    Actions.setIsClassBegin(false);
    if (fromID === mySelf.id) {
      liveRoom.destroyServerRoom();
    }
    liveRoom.leaveroom(true);
    liveRoom.uninit();
  }

  /* 处理房间配置项逻辑 */
  handleRoomConfig() {
    const { autoClassBegin } = YsGlobal.roomConfigItem;
    const myself = liveRoom.getMySelf();
    const { isClassBegin } = store.getState().classroom;
    if (YsGlobal.roomInfo.isMettingRoom && myself.role === 0) {
      // Signalling.sendSignallingSetRoomLayout({ roomLayout: 'videoLayout' }, false);
      if (!isClassBegin) {
        FetchService.roomStart();
      }
    } else if (myself.role === 0 && autoClassBegin && !isClassBegin) {
      FetchService.roomStart();
    }
  }

  /* 检测身份冲突 */
  checkRoleConflict() {
    const users = liveRoom.getUsers();
    for (const user of Object.values(users)) {
      if (liveRoom.getMySelf().id !== user.id) {
        if (user.role === ROOM_ROLE.TEACHER && liveRoom.getMySelf().role === ROOM_ROLE.TEACHER) {
          liveRoom.evictUser(user.id);
        }
      }
    }
  }

  /* 设置房间配置项 */
  setConfigItems(chairmancontrol = '', room) {
    const {
      roomInfo: { isLiveRoom },
    } = YsGlobal;
    const config = {
      autoClassBegin: !!parseInt(chairmancontrol.substr(32, 1), 10) && !isLiveRoom, // 自动上课
      isSupportPageTrun: !!parseInt(chairmancontrol.substr(38, 1), 10) && !isLiveRoom, // 上课前允许学生操作翻页
      hasScreenShare: !!parseInt(room.sharedesk, 10), // 桌面共享
      autoStartAV: !!parseInt(chairmancontrol.substr(23, 1), 10) && !isLiveRoom, // 自动开启音视频
      isShowStudentNum: !!parseInt(chairmancontrol.substr(200, 1), 10) && isLiveRoom, // 显示观众在线人数
      banPrivateChat: !!parseInt(chairmancontrol.substr(202, 1), 10) && isLiveRoom, // 禁止私聊
      canChat: !!parseInt(chairmancontrol.substr(201, 1), 10) && isLiveRoom, // 允许课前互动（聊天）
    };
    return config;
  }

  joinRoomErrorAlert(ret) {
    let text = '';
    const { roomListner } = YsGlobal.languageInfo.serviceText;
    switch (ret) {
      case -1:
        text = roomListner.code_1;
        break;
      case 3001:
        text = roomListner.code_3001;
        break;
      case 3002:
        text = roomListner.code_3002;
        break;
      case 3003:
        text = roomListner.code_3003;
        break;
      case 4007:
        text = roomListner.code_4007;
        break;
      case 4008:
        text = roomListner.code_4008;
        break;
      case 4110:
        text = roomListner.code_4110;
        break;
      case 4109:
        text = roomListner.code_4109;
        break;
      case 4103:
        text = roomListner.code_4103;
        break;
      case 4112:
        text = roomListner.code_4112;
        break;
      default:
        text = roomListner.lostClass;
        break;
    }
    Actions.changeModalMsg(
      {
        type: 'alert',
        message: text,
      },
      () => {
        document.documentElement.style.pointerEvents = 'none';
      },
    );
  }

  setRoomInfo(roominfo) {
    const { room } = roominfo;
    const roomType = parseInt(room.roomtype, 10);
    YsGlobal.roomInfo = {
      createtime: room.createtime,
      endtime: room.endtime,
      starttime: room.starttime,
      serial: room.serial,
      roomName: room.roomname,
      companyid: room.companyid, // 企业id
      videoheight: room.videoheight,
      videowidth: room.videowidth,
      isLiveRoom: false, // 直播
      isClassRoom: false, // 小班课
      isMettingRoom: false, // 会议
      roomType,
      maxVideo: parseInt(room.maxvideo, 10) || 0,
    };
    if (roomType === 0 || roomType === ROOM_TYPE.CLASS_ROOM) {
      YsGlobal.roomInfo.isClassRoom = true;
    } else if (roomType === ROOM_TYPE.LIVE_ROOM) {
      YsGlobal.roomInfo.isLiveRoom = true;
    } else if (roomType === ROOM_TYPE.MEETING_ROOM) {
      YsGlobal.roomInfo.isMettingRoom = true;
    }
    // YsGlobal.roomInfo.isClassRoom = false;
    // YsGlobal.roomInfo.isMettingRoom = true;
    YsGlobal.roomConfigItem = this.setConfigItems(room.chairmancontrol, room);
  }

  /* 处理房间msglist消息 */
  handleRoomMsgList(roomMsgList) {
    if (!roomMsgList.length) {
      return [];
    }
    YsGlobal.msgList = roomMsgList;
    roomMsgList.forEach(value => {
      try {
        if (value.data && typeof value.data === 'string') {
          // eslint-disable-next-line no-param-reassign
          value.data = JSON.parse(value.data);
        }
      } catch (e) {
        L.Logger.error(e);
      }
      switch (value.name) {
        case 'ClassBegin': {
          this.handleBeginClass(value);
          break;
        }
        case 'LiveNoticeInform': {
          Actions.setNoticeData(value.data);
          break;
        }
        case 'doubleClickVideo': {
          const { doubleId } = value.data || {};
          Actions.setDoubleVideoId(doubleId);
          break;
        }
        default:
          break;
      }
    });
    return roomMsgList;
  }

  /* 处理房间即将离开提示 */
  handleRoomEndNotice(message) {
    const { data = {} } = message;
    const { roomListner } = YsGlobal.languageInfo.serviceText;
    const { countdown = 120, reason } = data;
    // reason值为-1时，音视频已经发布过了（已经上课了），老师退出房间超过8分钟但是没有超过10分钟且在超过10分钟前又进入房间，则取消房间即将关闭
    // reason值为1时，音视频已经发布过了（已经上课了），但是老师退出房间达到8分钟，2分钟后房间即将关闭
    // reason值为2时，表示房间预约时间已到，30分钟后房间即将关闭
    // reason值为3时，表示已经超过房间预约时间28分钟，2分钟后房间即将关闭
    let text = '';
    if (reason === -1) {
      clearTimeout(this.teacherLeaveTimer);
    }
    if (reason === 1) {
      this.teacherLeaveTimer = setTimeout(() => {
        clearTimeout(this.teacherLeaveTimer);
        text = roomListner.roomEndNotice_1;
        Actions.changeModalMsg(
          {
            type: 'alert',
            message: text,
          },
          () => {
            this.handleEndClass();
            document.documentElement.style.pointerEvents = 'none';
          },
        );
      }, countdown * 1000);
      return;
    }
    if (reason === 2) {
      text = roomListner.roomEndNotice_2;
      Actions.changeModalMsg({
        type: 'alert',
        message: text,
      });
      return;
    }
    if (reason === 3) {
      text = roomListner.roomEndNotice_4;
      Actions.changeModalMsg({
        type: 'alert',
        message: text,
      });
      this.roomEndNoticeTimer = setTimeout(() => {
        clearTimeout(this.roomEndNoticeTimer);
        text = roomListner.roomEndNotice_3;
        Actions.changeModalMsg(
          {
            type: 'alert',
            message: text,
          },
          () => {
            this.handleEndClass();
            document.documentElement.style.pointerEvents = 'none';
          },
        );
      }, countdown * 1000);
    }
  }
}

export default RoomService.getInstance();
