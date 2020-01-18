import { liveRoom, EVENT_TYPE, ROOM_STATE, ERROR_NOTICE, WARNING_NOTICE } from '@global/roomConstants';
import Actions from '@global/actions';
import { YsGlobal } from '@global/handleGlobal';
import { myself } from '@utils/utils';
import { windowClose } from '@utils/ysUtils';
import store from '@app/store';
import { giftPush } from '@containers/Gift/Gift';
import RoomService from './RoomService';
import UserService from './UserService';
import DeviceService from './DeviceService';
import { setUserProperty } from '../../utils/sign';
import Signalling from './SignallingService';

const { serviceText } = YsGlobal.languageInfo;
const { roomListner } = serviceText;
class RoomListener {
  constructor() {
    this.instance = null;
    this.audioError = false;
    this.videoError = false;
  }

  /**
   *  roomlistener实例
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new RoomListener();
    }
    return this.instance;
  }

  // 房间断开连接
  roomDisconnected() {
    liveRoom.addEventListener(EVENT_TYPE.roomDisconnected, () => {
      Actions.setRoomStatus(ROOM_STATE.DISCONNECT);
      Actions.initClassRoomState();
      Actions.initModulesState();
      Actions.initVideoState();
    });
  }

  /**
   * 房间连接成功
   * event：保存信令的对象
   */
  roomConnected() {
    liveRoom.addEventListener(EVENT_TYPE.roomConnected, event => {
      const { message, currServerTs } = event;
      YsGlobal.connectServerTime = currServerTs;
      document.title = YsGlobal.roomInfo.roomName;

      RoomService.checkRoleConflict();
      UserService.getUsers();
      UserService.setTeacherId();
      UserService.getMySelfGift();
      DeviceService.getSystemInfo();

      if (YsGlobal.roomInfo.isLiveRoom) {
        YsGlobal.isCheckVideoDevice = true;
      }

      const roomMsgList = RoomService.handleRoomMsgList(message);
      RoomService.handleRoomConfig();
      Actions.setRoomStatus(ROOM_STATE.CONNECTED);
      if (YsGlobal.roomInfo.isMettingRoom) {
        UserService.autoStartAV();
      }
      liveRoom.dispatchEvent({ type: 'room-msglist', data: roomMsgList });
    });
  }

  roomCheckroom() {
    liveRoom.addEventListener(EVENT_TYPE.roomCheckroom, data => {
      if (!YsGlobal.entryUserId) {
        const myselfInfo = myself();
        window.history.replaceState({}, 'entry', `${decodeURIComponent(window.location.href)}&entryUserId=${myselfInfo.id}`);
      }
      const { ret, roominfo = {} } = data.message;
      if (ret !== 0) {
        RoomService.joinRoomErrorAlert(ret);
      } else {
        RoomService.setRoomInfo(roominfo);
      }
    });
  }

  roomCheckroomPlayback() {
    liveRoom.addEventListener(EVENT_TYPE.roomCheckroomPlayback, data => {
      const { ret, roominfo = {} } = data.message;
      if (ret !== 0) {
        RoomService.joinRoomErrorAlert(ret);
      } else {
        RoomService.setRoomInfo(roominfo);
      }
    });
  }

  /**
   * 用户属性改变
   */
  roomUserPropertyChanged() {
    liveRoom.addEventListener(EVENT_TYPE.roomUserPropertyChanged, ({ message, user, fromID }) => {
      if (message.giftnumber === 0) return;
      if (message.giftnumber && user.id !== fromID) {
        if (user.publishstate !== 0) {
          giftPush(user);
        }
      }
    });
  }

  roomServerAddressUpdate() {
    liveRoom.addEventListener(EVENT_TYPE.roomServerAddressUpdate, data => {
      YsGlobal.roomInfo.docHost = data.message.doc_host;
    });
  }

  // 网络质量检测
  roomUserNetworkStateChanged() {
    liveRoom.addEventListener(EVENT_TYPE.roomUserNetworkStateChanged, data => {
      const { networkStatus } = data.message;
      Actions.setNetworkState(networkStatus);
    });
  }

  /**
   * Room pub msg
   */
  roomPubmsg() {
    liveRoom.addEventListener(EVENT_TYPE.roomPubmsg, res => {
      const { name, data } = res.message;
      switch (name) {
        case 'ClassBegin':
          liveRoom.stopShareMedia();
          RoomService.handleBeginClass(res.message);
          window.localStorage.removeItem('remind');
          break;
        case 'Notice_PrepareRoomEnd':
          RoomService.handleRoomEndNotice(res.message);
          break;
        case 'doubleClickVideo':
          Actions.setDoubleVideoId(data.doubleId);
          break;
        case 'Notice_BigRoom_Usernum': {
          const { rolenums = {} } = data;
          Actions.setOnlineStudentNum(rolenums[2]);
          break;
        }
        // case 'Notice_EvictAllRoomUser':
        //   // 所有人都被踢出
        //   liveRoom.uninit();
        //   windowClose();
        //   break;
        default:
          break;
      }
    });
  }

  /**
   * 删除消息时
   */
  roomDelmsg() {
    liveRoom.addEventListener(EVENT_TYPE.roomDelmsg, res => {
      const { name } = res.message;
      switch (name) {
        case 'ClassBegin':
          RoomService.handleEndClass(res.message);
          break;
        case 'Notice_PrepareRoomEnd':
          RoomService.handleRoomEndNotice(res.message);
          break;
        case 'doubleClickVideo':
          Actions.setDoubleVideoId('');
          break;
        default:
          break;
      }
    });
  }

  /**
   * 视频发布状态改变时，发布或删除该视频
   */
  roomUserVideoStateChanged() {
    liveRoom.addEventListener(EVENT_TYPE.roomUserVideoStateChanged, () => {});
  }

  /**
   * 用户音频发生变化
   */
  roomUserAudioStateChanged() {
    liveRoom.addEventListener(EVENT_TYPE.roomUserAudioStateChanged, () => {});
  }

  /**
   * 用户被踢出
   */
  roomParticipantEvicted() {
    liveRoom.addEventListener(EVENT_TYPE.roomParticipantEvicted, data => {
      const { reason } = data.message;
      Actions.changeModalMsg(
        {
          type: 'alert',
          title: roomListner.msgTitle,
          okBtn: roomListner.okBtn,
          message: (reason === 1 && roomListner.removeUser) || roomListner.leaveMsg,
        },
        () => {
          liveRoom.uninit();
          windowClose();
          document.documentElement.style.pointerEvents = 'none';
        },
      );
    });
  }

  /**
   * 用户突然加入
   */
  roomParticipantJoin() {
    liveRoom.addEventListener(EVENT_TYPE.roomParticipantJoin, data => {
      const { user = {} } = data;
      if (user.role === 0) {
        Actions.setTeacherId(user.id);
      }
      UserService.getUsers();
    });
  }

  /**
   * 用户离开
   */
  roomParticipantLeave() {
    liveRoom.addEventListener(EVENT_TYPE.roomParticipantLeave, data => {
      const { user = {} } = data;
      if (user.role === 0) {
        Actions.setTeacherId('');
      }
      UserService.getUsers();
      UserService.setTeacherId();
    });
  }

  /**
   * 房间提示
   */
  roomNotice() {
    // 错误提示
    liveRoom.addEventListener(EVENT_TYPE.roomErrorNotice, res => {
      const { code } = res.message || {};
      if (code === ERROR_NOTICE.ERR_PUBLISH_ROOMMAXVIDEOLIMITED) {
        const mySelf = liveRoom.getMySelf();
        setUserProperty(mySelf.id, { publishstate: 0 });
      }
    });
    // 警告提示
    liveRoom.addEventListener(EVENT_TYPE.roomWarnNotice, res => {
      const { code } = res.message || {};
      if (code === WARNING_NOTICE.WAR_UNPUBLISHVIDEO_BY_GET_DEVICE_MEDIASTREAM_FAILURE) {
        this.videoError = true;
      } else if (code === WARNING_NOTICE.WAR_UNPUBLISHAUDIO_BY_GET_DEVICE_MEDIASTREAM_FAILURE) {
        this.audioError = true;
      }
      if (this.audioError && this.audioError) {
        this.audioError = false;
        this.videoError = false;
        const mySelf = liveRoom.getMySelf();
        const { teacherId } = store.getState().user;
        Signalling.sendSignallingGetUserMediaError({ errorType: 3, name: mySelf.nickname }, teacherId);
        setUserProperty(mySelf.id, { publishstate: 0 });
      }
    });
  }

  /**
   * 文档
   */
  roomFiles() {
    liveRoom.addEventListener(EVENT_TYPE.roomFiles, data => {
      Actions.setFileList(data.message);
    });
  }
}

export default RoomListener.getInstance();
