import store from '@app/store';
import Actions from '@global/actions';
import { liveRoom, ROOM_ROLE, EVENT_TYPE } from '@global/roomConstants';
import { YsGlobal } from '@global/handleGlobal';
import { emitter, getDate, myself } from '@utils/';
import Signalling from '../../global/services/SignallingService';

export default class VoteService {
  constructor() {
    this.resListenId = null;
    this.isPublicResult = false;
    this.voteEnd = this.voteEnd.bind(this);
    this.voteResults = this.voteResults.bind(this);
    liveRoom.addEventListener(EVENT_TYPE.roomPubmsg, this.pubmsgHandler.bind(this));
    liveRoom.addEventListener(EVENT_TYPE.roomDelmsg, this.delmsgHandler.bind(this));
    liveRoom.addEventListener('room-msglist', this.msglistHandler.bind(this));
  }

  pubmsgHandler({ message }) {
    const { data: voteInfo, name } = message;
    const mySelf = liveRoom.getMySelf();
    const handler = {
      VoteStart: () => {
        if (voteInfo.status === 'voting') {
          const { voteId, subject, sendVoteUserName, sendVoteTime, pattern, options } = voteInfo;
          const recordItem = {
            voteId,
            isVoting: true,
            subject,
            sendVoteUserName, // 发起投票的人名
            sendVoteTime, // 发起投票的时间
            pattern,
            options,
          };
          this.addVoteRecord(recordItem);
        }
        this.handleVoteMsg(voteInfo);
      },
      VoteResult: () => {
        const { values } = message;
        const { voteData } = store.getState().Modules.vote;
        const options = JSON.parse(JSON.stringify(voteData.options));
        Actions.setModuleData('vote', {
          options: options.map(option => {
            const opt = option;
            const value = (Object.entries(values).find(([key]) => key === opt.content) || [0, 0])[1];
            opt.count = Number(value);
            return opt;
          }),
        });
        if (this.isPublicResult) {
          this.isPublicResult = false;
          const { voteId, subject, sendVoteUserName, sendVoteTime, pattern, desc } = voteData;
          const data = {
            voteId,
            isVoting: false,
            subject,
            sendVoteUserName,
            sendVoteTime,
            pattern,
            desc,
            options,
          };
          Signalling.sendSignallingToPublicVoteResult(data);
        }
      },
      PublicVoteResult: () => {
        if (mySelf.role === ROOM_ROLE.STUDENT) {
          Actions.setModuleData('vote', voteInfo);
          Actions.setModuleStatus('vote', 'isShowVoteResult');
        }
      },
    };
    (handler[name] || (() => undefined))();
  }

  delmsgHandler({ message }) {
    const { name } = message;
    const handler = {
      VoteStart: () => {
        const { voteState, voteData } = store.getState().Modules.vote;
        const { voteId, subject, sendVoteUserName, sendVoteTime, pattern, options, createTime, desc } = voteData;
        const recordItem = {
          voteId,
          isVoting: false,
          subject,
          sendVoteUserName, // 发起投票的人名
          sendVoteTime, // 发起投票的时间
          pattern,
          options,
          createTime,
          desc,
        };
        if (voteState !== 'isSetVoteInfo') {
          this.addVoteRecord(recordItem);
        }
        this.close();
      },
    };
    (handler[name] || (() => undefined))();
  }

  msglistHandler(param) {
    const roomMsgList = param.data;
    const mySelf = liveRoom.getMySelf();
    roomMsgList.forEach(value => {
      switch (value.name) {
        case 'VoteStart': {
          this.handleVoteMsg(value.data);
          break;
        }
        case 'VoteRecordList': {
          if (mySelf.role !== ROOM_ROLE.STUDENT) {
            Actions.setModuleData('vote', value.data);
          }
          break;
        }
        default:
          break;
      }
    });
  }

  handleVoteMsg(data) {
    Actions.setModuleData('vote', data);
    Actions.setModuleStatus('vote', data.status);
    const mySelf = liveRoom.getMySelf();
    if (data.status === 'voting' && mySelf.role !== ROOM_ROLE.STUDENT) {
      this.resListenId = setInterval(this.voteResults, 5000);
    }
  }

  close() {
    Actions.setModuleStatus('vote', '');
    if (this.resListenId) {
      clearInterval(this.resListenId);
      this.resListenId = null;
      const { voteState, voteData } = store.getState().Modules.vote;
      if (voteState === 'voting') {
        const { voteRecordList, options } = voteData;
        const recordItem = voteRecordList[0] || {};
        recordItem.options = options;
        this.addVoteRecord(recordItem);
      }
    }
  }

  /* 开始设置投票信息 */
  startSetVoteInfo() {
    const date = new Date();
    const { serial } = YsGlobal.roomInfo; // 教室号
    const data = {
      voteId: serial + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + Math.round((Math.random() * 9 + 1) * 10000),
      sendVoteUserId: liveRoom.getMySelf().id,
      status: 'isSetVoteInfo',
    };
    Signalling.sendSignallingToVoteStart(false, data.voteId, data);
  }

  /* 发布投票 */
  pub(voteInfo) {
    const { voteId } = store.getState().Modules.vote.voteData;
    const { desc, options: opts, pattern, subject, selfUser = myself(), date = new Date() } = voteInfo;
    const options = opts.map(({ checked, content }) => ({
      isRight: checked,
      content,
      count: 0,
    }));
    const data = {
      voteId,
      sendVoteUserName: selfUser.nickname,
      subject,
      desc,
      pattern,
      status: 'voting',
      options,
      sendVoteTime: getDate(date),
      createTime: date.getTime(),
    };
    Signalling.sendSignallingToVoteStart(false, data.voteId, data, 'useCount');
  }

  /* 提交投票 */
  voteCommit(options) {
    const {
      voteData: { voteId },
    } = store.getState().Modules.vote;
    const actions = {};
    options.forEach(item => {
      if (item.checked) {
        actions[item.content] = 1;
      }
    });
    Signalling.sendSignallingToVoteCommit(voteId, '__none', actions, voteId);
    this.close();
  }

  /* 获取当前投票结果 */
  voteResults() {
    const {
      voteData: { voteId },
    } = store.getState().Modules.vote;
    const mySelfId = liveRoom.getMySelf().id;
    Signalling.sendSignallingToVoteResult(voteId, mySelfId, voteId);
  }

  /* 发送结束投票 */
  voteEnd(isPublicResult) {
    const { voteId } = store.getState().Modules.vote.voteData;
    this.isPublicResult = isPublicResult;
    this.voteResults();
    Signalling.sendSignallingToVoteStart(true, voteId);
  }

  /* 进入投票详情 */
  joinVoteDetails(detailsInfo) {
    let voteState = '';
    if (detailsInfo.isVoting) {
      this.resListenId = setInterval(this.voteResults.bind(this), 5000);
      voteState = 'voting';
    } else {
      voteState = 'isShowVoteResult';
    }
    Actions.setModuleStatus('vote', voteState);
    Actions.setModuleData('vote', detailsInfo);
  }

  /* 删除投票记录 */
  removeVoteRecord(voteId) {
    const mySelf = liveRoom.getMySelf();
    if (mySelf.role !== ROOM_ROLE.STUDENT) {
      const { voteRecordList } = store.getState().Modules.vote.voteData;
      const recordList = voteRecordList.filter(item => item.voteId !== voteId);
      const removeRecord = voteRecordList.find(item => item.voteId === voteId);
      Actions.setModuleData('vote', { voteRecordList: recordList });
      if (removeRecord.isVoting) {
        this.voteEnd();
      }
      Signalling.sendSignallingToVoteRecordList({ voteRecordList: recordList });
    }
  }

  /* 添加投票记录 */
  addVoteRecord(recordItem) {
    const mySelf = liveRoom.getMySelf();
    if (mySelf.role !== ROOM_ROLE.STUDENT) {
      const { voteRecordList } = store.getState().Modules.vote.voteData;
      const filterRecordList = voteRecordList.filter(item => item.voteId !== recordItem.voteId);
      const addRecordList = recordItem.isVoting ? [recordItem, ...filterRecordList] : [...filterRecordList, recordItem];
      Actions.setModuleData('vote', { voteRecordList: addRecordList });
      Signalling.sendSignallingToVoteRecordList({ voteRecordList: addRecordList });
    }
  }
}
