import { liveRoom, ROOM_ROLE, PUBLISH_STATE } from '@global/roomConstants';
import Actions from '@global/actions';
import { YsGlobal } from '../handleGlobal';
import { setUserProperty } from '../../utils/sign';
import FetchService from './FetchService';

class UserService {
  constructor() {
    this.instance = null;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new UserService();
    }
    return this.instance;
  }

  // 获取用户信息
  getUser(userId) {
    return liveRoom.getUser(userId);
  }

  // 用户加入或者离开，小班课的人数更新
  getUsers() {
    if (YsGlobal.roomInfo.isLiveRoom) {
      return;
    }
    const userList = liveRoom.getUsers();
    const list = [];
    let studentCount = 0;
    for (const value of Object.values(userList)) {
      list.push(value);
      if (value.role === 2) studentCount += 1;
    }
    Actions.setUserList(list);
    Actions.setStudentCount(studentCount);
  }

  setTeacherId() {
    const users = liveRoom.getUsers();
    for (const value of Object.values(users)) {
      if (value.role === ROOM_ROLE.TEACHER) {
        Actions.setTeacherId(value.id);
      }
    }
  }

  /* 用户功能-上下讲台信令的发送 */
  userPlatformUpOrDown(user) {
    const userPropertyData = {};
    const { isMettingRoom } = YsGlobal.roomInfo;
    if (user.publishstate === PUBLISH_STATE.NONE) {
      if (user.hasvideo) {
        userPropertyData.publishstate = user.hasaudio ? PUBLISH_STATE.BOTH : PUBLISH_STATE.VIDEOONLY;
      } else {
        userPropertyData.publishstate = user.hasaudio ? PUBLISH_STATE.AUDIOONLY : PUBLISH_STATE.MUTEALL;
      }
    } else {
      userPropertyData.publishstate = PUBLISH_STATE.NONE;
    }
    if (user.role !== ROOM_ROLE.ASSISTANT && user.role !== ROOM_ROLE.TEACHER && userPropertyData.publishstate === PUBLISH_STATE.NONE && user.candraw) {
      // 如果不是助教和老师, 如果下台并且当前可画,则设置不可画
      userPropertyData.candraw = false;
    }
    if (isMettingRoom && userPropertyData.publishstate === PUBLISH_STATE.BOTH) {
      userPropertyData.candraw = true;
    }
    setUserProperty(user.id, userPropertyData);
  }

  autoStartAV() {
    const mySelf = liveRoom.getMySelf();
    const { autoStartAV } = YsGlobal.roomConfigItem;

    if (mySelf.role === ROOM_ROLE.TEACHER) {
      liveRoom.publishVideo();
      liveRoom.publishAudio();
    } else if (autoStartAV && mySelf.role === ROOM_ROLE.STUDENT) {
      this.userPlatformUpOrDown(mySelf);
    }
  }

  /* 用户功能-打开关闭音频 */
  changeUserAudio(user) {
    const data = {};
    if (user.publishstate === PUBLISH_STATE.AUDIOONLY) {
      // 之前状态为1 ==>变为4
      data.publishstate = PUBLISH_STATE.MUTEALL;
    } else if (user.publishstate === PUBLISH_STATE.VIDEOONLY) {
      // 之前状态为2 ==>变为3
      data.publishstate = PUBLISH_STATE.BOTH;
    } else if (user.publishstate === PUBLISH_STATE.BOTH) {
      // 之前状态为3 ==>变为2
      data.publishstate = PUBLISH_STATE.VIDEOONLY;
    } else if (user.publishstate === PUBLISH_STATE.MUTEALL) {
      // 之前状态为4 ==>变为1
      data.publishstate = PUBLISH_STATE.AUDIOONLY;
    } else if (user.publishstate === PUBLISH_STATE.NONE) {
      // 之前状态为0 ==>变为1
      data.publishstate = PUBLISH_STATE.AUDIOONLY;
    }
    setUserProperty(user.id, data);
  }

  /* 用户功能-打开关闭视频 */
  changeUserVideo(user) {
    const data = {};
    if (user.publishstate === PUBLISH_STATE.AUDIOONLY) {
      // 之前状态为1 ==>变为3
      data.publishstate = PUBLISH_STATE.BOTH;
    } else if (user.publishstate === PUBLISH_STATE.VIDEOONLY) {
      // 之前状态为2 ==>变为4
      data.publishstate = PUBLISH_STATE.MUTEALL;
    } else if (user.publishstate === PUBLISH_STATE.BOTH) {
      // 之前状态为3 ==>变为1
      data.publishstate = PUBLISH_STATE.AUDIOONLY;
    } else if (user.publishstate === PUBLISH_STATE.MUTEALL) {
      // 之前状态为4 ==>变为2
      data.publishstate = PUBLISH_STATE.VIDEOONLY;
    } else if (user.publishstate === PUBLISH_STATE.NONE) {
      // 之前状态为0 ==>变为2
      data.publishstate = PUBLISH_STATE.VIDEOONLY;
    }
    setUserProperty(user.id, data);
  }

  /* 改变用户的画笔权限 */
  changeUserCandraw(user) {
    const data = {};
    data.candraw = !user.candraw;
    // 之前状态为0 ==>变为4
    if (user.publishstate === PUBLISH_STATE.NONE) {
      data.publishstate = PUBLISH_STATE.MUTEALL;
    }
    setUserProperty(user.id, data);
  }

  /* 单独用户禁言 */
  userBanSpeak(user, disablechat) {
    const data = {
      disablechat: disablechat !== undefined ? disablechat : !user.disablechat,
    };
    setUserProperty(user.id, data);
  }

  /* 改变用户画笔颜色 */
  changeVideoUserPen(userId, primaryColor) {
    setUserProperty(userId, { primaryColor });
  }

  /* 给用户发奖杯 */
  sendUserGift(user) {
    const participantIdJson = {
      [user.id]: user.nickname,
    };
    FetchService.sendGift(participantIdJson).then(data => {
      if (user && data.result === 0) {
        let giftnumber = parseInt(user.giftnumber, 10) || 0;
        giftnumber += 1;
        const propertyInfo = {
          giftnumber,
        };
        setUserProperty(user.id, propertyInfo);
      }
    });
  }

  /* 获取自己礼物数 */
  getMySelfGift() {
    const mySelf = liveRoom.getMySelf();
    if (mySelf.role === ROOM_ROLE.STUDENT && !YsGlobal.roomInfo.isLiveRoom) {
      FetchService.getGiftInfo(mySelf.id).then(res => {
        if (res.result === 0) {
          const { giftinfo = [] } = res;
          const giftInfo = giftinfo[0] || {};
          const propertyInfo = {
            giftnumber: parseInt(giftInfo.giftnumber, 10),
          };
          setUserProperty(mySelf.id, propertyInfo);
        }
      });
    }
  }
}

export default UserService.getInstance();
