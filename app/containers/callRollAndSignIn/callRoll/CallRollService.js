import store from '@app/store';
import Actions from '@global/actions';
import { liveRoom } from '@global/roomConstants';
import { YsGlobal } from '@global/handleGlobal';
import Signalling from '@global/services/SignallingService';
import FetchService from '@global/services/FetchService';
import { emitter } from '@utils';
import utils from '../utils';

const TimeStamp = [60000, 180000, 300000, 600000, 1800000];

export default class CallRollService {
  callRollTimer = null; // 当前点名计时器

  currentCRID = ''; // 当前点名ID

  constructor() {
    emitter.on('room-msglist', this.msglistHandler.bind(this));
    emitter.on('room-pubmsg', this.pubmsgHandler.bind(this));
    emitter.on('room-delmsg', this.delmsgHandler.bind(this));
  }

  pubmsgHandler({ message }) {
    const { name, data, fromID } = message;

    const handlers = {
      LiveCallRoll: () => {
        const isOtherOccupyed = data.status === 'occupyed' && fromID !== liveRoom.getMySelf().id;
        if (isOtherOccupyed && !data.callRollId) {
          Actions.setModuleStatus('callRoll', 'disable');
          return;
        }
        this.currentCRID = data.callRollId;
        this.liveCallRollHandler(data, TimeStamp[Number(data.stateType)], isOtherOccupyed);
      },
      StudentSingin: () => {
        if (data.studentId === liveRoom.getMySelf().id) this.close();
      },
    };
    (handlers[name] || (() => {}))();
  }

  delmsgHandler({ message }) {
    if (message.name === 'LiveCallRoll') this.close();
  }

  msglistHandler(param) {
    const roomMsgList = param.data.filter(item => ['LiveCallRoll', 'StudentSingin'].includes(item.name));
    const handlers = {
      LiveCallRoll: message => {
        const {
          data: { stateType, time, status, callRollId },
          fromID,
        } = message;
        const isOtherOccupyed = status === 'occupyed' && fromID !== liveRoom.getMySelf().id;
        if (isOtherOccupyed && !callRollId) {
          Actions.setModuleStatus('callRoll', 'disable');
          return;
        }
        const { role } = liveRoom.getMySelf();
        this.currentCRID = callRollId;
        const chaTime = TimeStamp[stateType] - (joinRoomTime - time) * 1000; // 剩余倒计时时间
        this.liveCallRollHandler(message.data, TimeStamp[Number(stateType)] - (YsGlobal.connectServerTime - message.ts) * 1000, isOtherOccupyed);
        if (![0, 1].includes(role)) return;
        // 老师和助教逻辑
        const joinRoomTime = YsGlobal.connectServerTime; // 进入房间时间
        const { serial } = YsGlobal.roomInfo;
        this.currentCRID = this.currentCRID || utils.getUniqueId(serial); // 获取当前点名ID
        if ((joinRoomTime - time) * 1000 < TimeStamp[stateType]) {
          // 点名未结束
          setTimeout(() => {
            this.stopCallRoll();
          }, chaTime);
        }
      },
      StudentSingin: message => {
        if (message.data.studentId === liveRoom.getMySelf().id) this.close();
      },
    };

    roomMsgList.forEach(value => {
      (handlers[value.name] || (() => {}))(value);
    });
  }

  liveCallRollHandler(data, timeRemaining, isOtherOccupyed) {
    const { nickname, role } = liveRoom.getMySelf();
    if ([0, 1].includes(role)) {
      // 老师和助教逻辑
      this.getPersonNumTimer = setInterval(() => {
        this.getOnlineNum();
      }, 5000);
      Actions.setModuleData('callRoll', {
        timeLenIndex: Number(data.stateType),
        callRollList: [
          ...(data.callRollList || []),
          {
            id: this.currentCRID,
            timerType: data.stateType,
            signInNum: 0,
            time: new Date(data.time * 1000).toLocaleTimeString(),
            nickname,
            status: 'PUB',
          },
        ],
      });
      if (isOtherOccupyed || data.callRollId) {
        Actions.setModuleStatus('callRoll', 'calling');
      } else {
        Actions.setModuleStatus('callRoll', 'call');
      }
      return;
    }
    Actions.setModuleData('callRoll', {
      timeLenIndex: Number(data.stateType),
      timeRemaining,
      currentCRID: this.currentCRID,
    });
    Actions.setModuleStatus('callRoll', 'signin');
  }

  startCallRoll() {
    const {
      Modules: {
        callRoll: {
          callRollData: { callRollList, timeLenIndex },
        },
      },
    } = store.getState();
    const user = liveRoom.getMySelf();
    if (!this.callRollTimer) {
      this.callRollTimer = setTimeout(() => {
        this.stopCallRoll();
      }, TimeStamp[timeLenIndex]);
    }

    this.currentCRID = utils.getUniqueId(YsGlobal.roomInfo.serial); // 获取当前点名ID
    this.cTime = utils.getTs(); // 当前时间

    const sendCallRolMsg = {
      time: this.cTime,
      stateType: timeLenIndex,
      callRollId: this.currentCRID, // 点名id
      callRollList,
      status: 'occupyed',
    };
    // 发布点名
    Signalling.sendSignallingFromLiveCallRoll(false, sendCallRolMsg, YsGlobal.roomInfo.serial);
    // 添加当前点名到列表中
    this.addCallRollToList({
      id: this.currentCRID,
      timerType: timeLenIndex,
      signInNum: 0,
      time: new Date().toLocaleTimeString(),
      nickname: user.nickname,
      status: 'PUB',
    });
    // 定时获取当前签到认输
    this.getPersonNumTimer = setInterval(() => {
      this.getOnlineNum();
    }, 5000);
    Actions.setModuleStatus('callRoll', 'calling');
  }

  async stopCallRoll() {
    await this.getOnlineNum();
    const {
      Modules: {
        callRoll: {
          callRollData: { callRollList, timeLenIndex },
        },
      },
    } = store.getState();
    // 结束点名，改变状态为显示点名窗口
    const ajaxData = {
      serial: YsGlobal.roomInfo.serial,
      callrollid: this.currentCRID,
      callrolltime: TimeStamp[timeLenIndex] / 1000,
      createtime: this.cTime,
      callrollnumber: this.signInNum,
    };
    await FetchService.rollcalladd(ajaxData);
    this.updateCallRollData();
    const signData = {
      time: this.cTime,
      stateType: timeLenIndex,
      callRollId: this.currentCRID, // 点名id
      callRollList: callRollList.map(item => ({ ...item, status: 'FINISH' })),
    };
    Signalling.sendSignallingFromLiveCallRoll(true, signData, YsGlobal.roomInfo.serial);
    this.currentCRID = undefined;
    this.cTime = undefined;
    clearInterval(this.getPersonNumTimer);
    clearTimeout(this.callRollTimer);
    this.callRollTimer = null;
    this.signInNum = 0;
    Actions.setModuleStatus('callRoll', 'call');
    Actions.setModuleData('callRoll', { timeLenIndex: 0 });
  }

  /* 添加签到列表 */
  addCallRollToList(data) {
    Actions.setModuleData('callRoll', {
      callRollList: [...store.getState().Modules.callRoll.callRollData.callRollList, data],
    });
  }

  /* 更新签到列表 状态or人数 */
  updateCallRollData(data, key) {
    Actions.setModuleData('callRoll', {
      callRollList: store.getState().Modules.callRoll.callRollData.callRollList.map(item => {
        if (item.id !== this.currentCRID) return item;
        if (key === 'signInNum') return { ...item, signInNum: data.signInNum };
        return { ...item, status: 'FINISH' };
      }),
    });
  }

  /* 获取在线签到人数 */
  async getOnlineNum() {
    const ajaxData = {
      serial: YsGlobal.roomInfo.serial,
      callrollid: this.currentCRID,
    };
    const res = await FetchService.getOnlineNum(ajaxData);
    this.signInNum = res.num;
    this.updateCallRollData({ signInNum: res.num }, 'signInNum');
  }

  close() {
    this.updateCallRollData();
    Actions.setModuleStatus('callRoll', '');
  }
}
