import store from '@app/store';
import Actions from '@global/actions';
import { liveRoom } from '@global/roomConstants';
import { YsGlobal } from '@global/handleGlobal';
import Signalling from '@global/services/SignallingService';
import FetchService from '@global/services/FetchService';
import { setStorage, getStorage } from '@utils/ysUtils';
import { emitter, getTimeDifferenceToFormat } from '@utils';
// import utils from '../utils';

export default class AnswerService {
  getResultTimer = null; // 获取结果计时器

  getDetailTimer = null; // 获取答题详情计时器

  durationTimer = null; // 开始时间计时器

  isDetailPanel = false; // 当前展示是否为详情面板

  isPublicResult = false;

  currPage = 1; // 当前页

  isClose = false; // 是否关闭

  constructor() {
    emitter.on('room-msglist', this.msglistHandler.bind(this));
    emitter.on('room-pubmsg', this.pubmsgHandler.bind(this));
    emitter.on('room-delmsg', this.delmsgHandler.bind(this));
  }

  getHandler(name) {
    const handlers = {
      Answer: ({ data, id, ts, fromID }) => {
        const { options, status } = data;
        Actions.setModuleData('answer', {
          answerId: id,
        });
        if (status === 'occupyed' && fromID !== liveRoom.getMySelf().id) {
          Actions.setModuleStatus('answer', 'disable');
          return;
        }
        if (status === 'occupyed' && fromID === liveRoom.getMySelf().id) {
          Actions.setModuleStatus('answer', 'creating');
          return;
        }
        Actions.setModuleData('answer', {
          ...data,
          answerId: id,
          selecteds: options.map(opt => ({ [opt.content]: 0 })).reduce((prev, curr) => ({ ...(prev || {}), ...curr })),
          duration: '00:00:00',
          startTime: ts,
        });
        if (![0, 1].includes(liveRoom.getMySelf().role)) {
          let commitedAnswer = {};
          try {
            commitedAnswer = JSON.parse(getStorage('commitedAnswer')) || {};
          } catch {
            commitedAnswer = {};
          }
          if (commitedAnswer.answerId === id) {
            Actions.setModuleData('answer', {
              commitedAnswer,
            });
          }
          Actions.setModuleStatus('answer', 'answerSelecting');
          return;
        }
        this.getResultTimer = setInterval(() => {
          this.updateAnswerData();
        }, 5000);
        this.durationTimer = setInterval(() => {
          const { hh = '00', mm = '00', ss = '00' } = getTimeDifferenceToFormat(ts * 1000, Date.parse(new Date()));
          Actions.setModuleData('answer', {
            duration: `${hh}:${mm}:${ss}`,
          });
        }, 1000);
        Actions.setModuleStatus('answer', 'answer');
      },
      AnswerGetResult: async ({ values, ts: endTime, answerCount: totalUsers = 0 }) => {
        const { answerId, duration, options } = store.getState().Modules.answer.answerData;
        Actions.setModuleData('answer', {
          selecteds: { ...options.map(opt => ({ [opt.content]: 0 })).reduce((prev, curr) => ({ ...(prev || {}), ...curr })), ...values },
          totalUsers,
        });
        // 在这里请求详情接口，带startTime和当前信令endTime
        if (this.isDetailPanel) {
          this.getAnswerDetail(endTime);
        }
        if (this.isPublicResult) {
          this.currPage = -1;
          await this.getAnswerDetail(endTime);
          const { detailData, selecteds, detailPageInfo } = store.getState().Modules.answer.answerData;
          Signalling.sendAnswerPublic({ answerId, selecteds, duration, detailData, detailPageInfo, totalUsers, isPublicResult: this.isPublicResult }, answerId);
          // this.isPublicResult = false;
        }
      },
      AnswerPublicResult: ({ data, fromID }) => {
        if ([0, 1].includes(liveRoom.getMySelf().role)) {
          if (liveRoom.getMySelf().id !== fromID) {
            Actions.setModuleStatus('answer', 'stoped');
          }
          return;
        }
        const { answerId, selecteds, isPublicResult, detailData, detailPageInfo, totalUsers, duration } = data;
        let myAnswers = [];
        detailData.forEach(detail => {
          if (detail.userId === liveRoom.getMySelf().id) {
            myAnswers = detail.selectOpts;
          }
        });
        Actions.setModuleData('answer', {
          myAnswers,
          totalUsers,
          duration,
          answerId,
          selecteds,
          isPublicResult,
          detailData,
          detailPageInfo: { ...detailPageInfo, current: 1 },
        });
        Actions.setModuleStatus('answer', 'stoped');
        // setStorage('commitedAnswer', '');
      },
    };
    return handlers[name] || (() => {});
  }

  pubmsgHandler({ message }) {
    this.getHandler(message.name)(message);
  }

  delmsgHandler({ message }) {
    if (message.name === 'Answer') {
      this.updateAnswerData();
      clearInterval(this.getResultTimer);
      clearInterval(this.durationTimer);
      if (this.isPublicResult && liveRoom.getMySelf().id === message.fromID) return;
      if (!this.isClose && liveRoom.getMySelf().id === message.fromID) Actions.setModuleStatus('answer', 'stoped');
      else Actions.setModuleStatus('answer', '');
      setStorage('commitedAnswer', '');
      // this.close();
    }
    if (message.name === 'AnswerPublicResult') {
      this.close();
    }
  }

  msglistHandler(param) {
    const roomMsgList = param.data.filter(item => ['Answer', 'AnswerResult'].includes(item.name));
    roomMsgList.forEach(message => {
      this.getHandler(message.name)(message);
    });
  }

  updateAnswerData() {
    if ([0, 1].includes(liveRoom.getMySelf().role)) Signalling.sendAnswerResult(store.getState().Modules.answer.answerData.answerId, liveRoom.getMySelf().id);
  }

  pubAnswer(data) {
    const { serial } = YsGlobal.roomInfo;
    const { answerId } = store.getState().Modules.answer.answerData;
    Signalling.sendAnswerCreated(false, { ...data, answerId }, serial);
  }

  stopAnswer(isPublicResult) {
    this.isPublicResult = isPublicResult;
    this.isClose = false;
    this.updateAnswerData();
    if (!this.isPublicResult) Signalling.sendAnswerCreated(true, { answerId: store.getState().Modules.answer.answerData.answerId });
    clearInterval(this.getResultTimer);
    clearInterval(this.getDetailTimer);
    clearInterval(this.durationTimer);
    Actions.setModuleStatus('answer', 'stoped');
    Signalling.sendAnswerCreated(true, { answerId: store.getState().Modules.answer.answerData.answerId });
  }

  async startGetDetail(page) {
    this.isDetailPanel = true;
    this.currPage = page;
    if (![0, 1].includes(liveRoom.getMySelf().role)) return;
    // 点击详情按钮时发一次请求
    await this.getAnswerDetail(
      Date.parse(new Date())
        .toString()
        .substr(0, 10),
    );
  }

  stopGetDetail() {
    this.isDetailPanel = false;
  }

  async getAnswerDetail(endTime) {
    const { answerId, startTime } = store.getState().Modules.answer.answerData;
    const reqData = {
      id: answerId,
      starttime: startTime,
      endtime: endTime,
    };
    if (this.currPage !== -1) {
      // reqData.page = this.currPage ? this.currPage - 1 : 0;
      // reqData.pageNum = 6;
    }
    const res = await FetchService.getAnswerDetail(reqData);
    const { data = [], page, count = 1 } = res || {};
    const detailData = data.map(({ userid: userId, ts, data: selectOpts }) => {
      const studentname = (liveRoom.getUser(userId) || {}).nickname;
      const time = getTimeDifferenceToFormat(startTime * 1000, ts * 1000);
      return {
        selectOpts,
        userId,
        timestr: `${time.mm}:${time.ss}`,
        studentname,
      };
    });
    Actions.setModuleData('answer', {
      detailData,
      detailPageInfo: {
        current: page,
        total: Math.ceil(count / 6),
      },
    });
  }

  reStart() {
    const { serial } = YsGlobal.roomInfo;
    if (this.isPublicResult) Signalling.sendAnswerCreated(true, { answerId: store.getState().Modules.answer.answerData.answerId });
    this.isPublicResult = false;
    Signalling.sendAnswerPublic({}, store.getState().Modules.answer.answerData.answerId, true);
    Signalling.sendAnswerCreated(false, { status: 'occupyed' }, serial);
  }

  studentCommit(data, options, isUpdate = false) {
    const { answerId } = store.getState().Modules.answer.answerData;
    Signalling.sendAnswerCommit(data, options, answerId, isUpdate);
    const commitedAnswer = getStorage('commitedAnswer');
    if (commitedAnswer && commitedAnswer.answerId === answerId) {
      setStorage('commitedAnswer', JSON.stringify({ options: { ...commitedAnswer.options, ...options }, answerId }));
    } else {
      setStorage('commitedAnswer', JSON.stringify({ options, answerId }));
    }
    // this.close();
  }

  close() {
    const myself = liveRoom.getMySelf();
    if ([0, 1].includes(myself.role)) {
      const { answerId } = store.getState().Modules.answer.answerData;
      Signalling.sendAnswerPublic({}, answerId, true);
    }
    // this.updateAnswerData();
    clearInterval(this.getResultTimer);
    Actions.setModuleStatus('answer', '');
    this.isClose = true;
    Signalling.sendAnswerCreated(true, { answerId: store.getState().Modules.answer.answerData.answerId });
    this.isPublicResult = false;
  }
}
