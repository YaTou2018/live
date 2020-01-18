import store from '@app/store';
import Actions from '@global/actions';
import Toast from '@components/Toast';
import { YsGlobal } from '@global/handleGlobal';
import { liveRoom, EVENT_TYPE } from '@global/roomConstants';
import { post, emitter } from '@utils';
import Signalling from '../../global/services/SignallingService';

const { lucky } = YsGlobal.languageInfo;
const { luckyServiceInner } = lucky;
const listernerBackupid = `${new Date().getTime()}_${Math.random()}`;

let countdown = null;

export default class LuckyService {
  constructor() {
    liveRoom.addEventListener(EVENT_TYPE.roomPubmsg, this.pubmsgHandler.bind(this));
    liveRoom.addEventListener(EVENT_TYPE.roomDelmsg, this.delmsgHandler.bind(this), listernerBackupid);
    emitter.on('room-msglist', this.msglistHandler.bind(this));
  }

  pubmsgHandler({ message }) {
    const { name } = message;
    // const { luckyState } = store.getState().Modules.luckyDraw;
    const mySelfInfo = liveRoom.getMySelf() || {};

    const handler = {
      LiveLuckDrawResult: () => {
        this.setLuckyDrawData(message);
        if ([0, 1].includes(mySelfInfo.role)) {
          // role: -1回放 0老师 1助教 2学生  回放和学生时状态为winners
          Actions.setModuleStatus('luckyDraw', 'ready');
        } else {
          Actions.setModuleStatus('luckyDraw', 'winners');
        }
      },
      LiveLuckDraw: () => {
        this.setLuckDrawStatus(message, () => {
          // 倒计时
          if (countdown) {
            clearInterval(countdown);
          }
          Actions.luckyDrawCount(3);
          countdown = setInterval(() => {
            const { countdownNum } = store.getState().Modules.luckyDraw;
            if (countdownNum < 0) {
              clearInterval(countdown);
            }
            Actions.luckyDrawCount(countdownNum - 1);
          }, 1000);
        });
      },
    };
    (handler[name] || (() => undefined))();
  }

  delmsgHandler({ message }) {
    const { name } = message;
    const handler = {
      LiveLuckDraw: () => {
        Actions.setModuleStatus('luckyDraw', '');
        Actions.setModuleData('luckyDraw', {
          winners: [],
        });
      },
    };
    (handler[name] || (() => undefined))();
  }

  msglistHandler(param) {
    const roomMsgList = param.data.filter(item => ['LiveLuckDraw', 'LiveLuckDrawResult'].includes(item.name));
    const message = roomMsgList[roomMsgList.length - 1];
    this.setLuckDrawStatus(message);
  }

  close() {
    const mySelfInfo = liveRoom.getMySelf() || {};
    if (mySelfInfo.role !== 2) {
      Signalling.sendSignallingToLiveLuckDraw(true, `luck_${YsGlobal.roomInfo.serial}`, {}, false);
      Signalling.sendSignallingToLiveLuckDrawResult(true, `luckR_${YsGlobal.roomInfo.serial}`, {});
    }
    Actions.setModuleStatus('luckyDraw', '');
  }

  async pubLuckyDraw(luckdrawNum, excloudWinners) {
    const { date = new Date() } = store.getState();
    const mySelfInfo = liveRoom.getMySelf() || {};
    if (![0, 1].includes(Number(mySelfInfo.role))) {
      return;
    }
    // 抽奖接口
    const url = `${YsGlobal.serviceInfo.webRequest}/ClientAPI/lotterydraws?ts=${new Date().getTime()}`;
    const res = await post(url, {
      initiatorid: mySelfInfo.id,
      initiator: mySelfInfo.nickname,
      lotteryid: YsGlobal.roomInfo.serial + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + Math.round((Math.random() * 9 + 1) * 10000),
      starttime: date.valueOf(),
      serial: YsGlobal.roomInfo.serial,
      isReLotterydraw: excloudWinners ? 0 : 1,
      num: luckdrawNum,
    });
    if (!res) return;
    const { result, data = [], messages = '' } = res;
    const winners = data;
    const data_ = {
      fromName: mySelfInfo.nickname,
      state: 1,
      winners,
      fromUser: mySelfInfo,
      luckdrawNum,
      isReLotterydraw: excloudWinners ? 0 : 1,
      luckyState: 'pub',
    };
    if (Number(result) === 0) {
      if (winners && winners.length > 0) {
        Signalling.sendSignallingToLiveLuckDraw(false, `luck_${YsGlobal.roomInfo.serial}`, data_);
      } else {
        // ServiceTooltip.showError(YsGlobal.language.languageData.broadcast.noWinningStudent);
      }
    } else {
      const handler = {
        '95000': luckyServiceInner.abnormalNum,
        '95001': luckyServiceInner.failure,
        '95100': luckyServiceInner.abnormalTransfor,
        '95103': luckyServiceInner.siginEnd,
        '95104': luckyServiceInner.noneList,
        '95105': luckyServiceInner.insuNum,
      };
      Toast.error(handler[result] || messages);
    }
  }

  stopLuckyDraw() {
    const {
      Modules: {
        luckyDraw: { luckyData },
      },
    } = store.getState();
    const mySelfInfo = liveRoom.getMySelf() || {};
    const data = {
      fromName: mySelfInfo.nickname,
      state: 0,
      winners: {
        winners: luckyData.winners.map(({ id, name }) => ({
          buddyid: id,
          buddyname: name,
        })),
        endtime: this.newtime(),
        result: 0,
      },
      fromUser: mySelfInfo,
      luckyState: 'ready',
      luckdrawNum: luckyData.luckdrawNum,
      isReLotterydraw: luckyData.isReLotterydraw,
    };
    Signalling.sendSignallingToLiveLuckDrawResult(false, `luckR_${YsGlobal.roomInfo.serial}`, data);
  }

  setLuckDrawStatus(message, callback = undefined) {
    if (!message || Object.keys(message.data).length === 0) {
      Actions.setModuleStatus('luckyDraw', '');
      return;
    }
    const mySelfInfo = liveRoom.getMySelf() || {};
    const { state } = message.data;
    if (mySelfInfo.role !== 2) {
      if (!message.data.luckyState) {
        Actions.setModuleStatus('luckyDraw', 'pub');
      } else {
        Actions.setModuleStatus('luckyDraw', message.data.luckyState);
      }
      if (typeof callback === 'function' && message.data.luckyState === 'pub') {
        callback();
      }
    } else if (state === 0) {
      Actions.setModuleStatus('luckyDraw', 'winners');
    } else if (message.data.luckyState !== 'ready') {
      Actions.setModuleStatus('luckyDraw', 'lottery');
    }
    this.setLuckyDrawData(message);
  }

  setLuckyDrawData(message) {
    const { winners = [], luckdrawNum = 1, isReLotterydraw = 1 } = message.data;
    const winners_ = Array.isArray(winners) ? winners : winners.winners;
    Actions.setModuleData('luckyDraw', {
      winners: winners_.map(({ userid, buddyid, buddyname }) => ({
        name: buddyname,
        id: userid || buddyid,
      })),
      luckdrawNum,
      isReLotterydraw,
      endtime: winners.endtime,
    });
  }

  newtime() {
    const date = new Date();
    const nowDate = `${this.timerTwo(date.getMonth() + 1)}-${this.timerTwo(date.getDate())} ${this.timerTwo(date.getHours())}:${this.timerTwo(
      date.getMinutes(),
    )}`;
    return this.timerTwo(nowDate);
  }

  timerTwo(nowDate) {
    if (nowDate < 10) {
      return `0${nowDate}`;
    }
    return nowDate;
  }
}
