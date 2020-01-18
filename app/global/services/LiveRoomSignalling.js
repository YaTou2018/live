import { sendSignalling } from '../../utils';
import { YsGlobal } from '../handleGlobal';

const TestSortId = 'TestSortId';
/* 只有直播才有的信令 */
export const LiveRoomSignalling = {
  /**
   * 直播端点名相关信令
   */
  sendSignallingFromLiveCallRoll(isDelMsg, data, serial) {
    const signallingName = 'LiveCallRoll';
    const toID = '__allExceptSender';
    const associatedMsgID = data.assID || '';
    const id = `callroll_${serial}`;
    sendSignalling({
      isDelMsg,
      name: signallingName,
      signalId: id,
      toId: toID,
      data,
      isSave: true,
      associatedMsgID,
    });
  },
  /* 学生签到信令 */
  sendSignallingToStudentSingin(isDelMsg, toId, signalId, data) {
    const sendSignalData = {
      name: 'StudentSingin',
      signalId,
      data,
      isDelMsg,
      isSave: true,
      toId,
    };
    sendSignalling(sendSignalData);
  },
  /* 改变抽奖人数信令 */
  sendSignallingToLiveLuckDrawConfig(data) {
    const sendSignalData = {
      name: 'LiveLuckDrawConfig',
      signalId: 'LiveLuckDrawConfig',
      data,
    };
    sendSignalling(sendSignalData);
  },
  /*
  发送抽奖信令
    data：{
      state：1,开始抽奖为1，结束抽奖为0 ，
    }
   */
  sendSignallingToLiveLuckDraw(isDelMsg, signalId, data, isSave = true) {
    const sendSignalData = {
      name: 'LiveLuckDraw',
      signalId,
      isDelMsg,
      data,
      isSave,
    };
    sendSignalling(sendSignalData);
  },
  /* 发送抽奖结果信令 */
  sendSignallingToLiveLuckDrawResult(isDelMsg, signalId, data) {
    const sendSignalData = {
      name: 'LiveLuckDrawResult',
      signalId,
      isDelMsg,
      data,
    };
    sendSignalling(sendSignalData);
  },
  /* 送花信令 */
  sendSignallingToSendGifts(data) {
    const { serial } = YsGlobal.roomInfo;
    const signalId = `givigGifts_${serial}`;
    const sendSignalData = {
      name: 'LiveGivigGifts',
      signalId,
      // toId,
      isSave: false,
      data,
      isDelMsg: false,
    };
    sendSignalling(sendSignalData);
  },
  /* 发送发布投票信令 */
  sendSignallingToVoteStart(isDelMsg, signalId, data, type) {
    const sendSignalData = {
      name: 'VoteStart',
      signalId,
      data,
      type,
      isDelMsg,
    };
    sendSignalling(sendSignalData);
  },
  /* 发送提交投票信令 */
  sendSignallingToVoteCommit(signalId, toId, actions, associatedMsgID) {
    const sendSignalData = {
      name: 'voteCommit',
      signalId,
      toId,
      isSave: false,
      type: 'count',
      modify: 0, // 必须,0:不修改，1：修改
      actions,
      associatedMsgID,
      isDelMsg: false,
    };
    sendSignalling(sendSignalData);
  },
  /* 发送获取当前投票结果信令 */
  sendSignallingToVoteResult(signalId, toId, associatedMsgID) {
    const sendSignalData = {
      name: 'VoteResult',
      signalId,
      toId,
      isSave: false,
      type: 'getCount',
      associatedMsgID,
      isDelMsg: false,
    };
    sendSignalling(sendSignalData);
  },
  /* 发送投票记录列表信令 */
  sendSignallingToVoteRecordList(data) {
    const sendSignalData = {
      name: 'VoteRecordList',
      signalId: 'VoteRecordList',
      toId: '__none',
      data,
      isSave: true,
      isDelMsg: false,
    };
    sendSignalling(sendSignalData);
  },
  /* 发送投票结果信令 */
  sendSignallingToPublicVoteResult(data) {
    const sendSignalData = {
      name: 'PublicVoteResult',
      signalId: 'PublicVoteResult',
      toId: '__allExceptSender',
      data,
      isSave: false,
      isDelMsg: false,
    };
    sendSignalling(sendSignalData);
  },
  /* 发送通知信令 */
  sendSignallingToNoticeInform(data) {
    const sendSignalData = {
      name: 'LiveNoticeInform',
      signalId: 'LiveNoticeInform',
      isDelMsg: false,
      data,
    };
    sendSignalling(sendSignalData);
  },
  /* 发送公告信令 */
  sendSignallingToNoticeBoard(data) {
    const sendSignalData = {
      name: 'LiveNoticeBoard',
      signalId: 'LiveNoticeBoard',
      isDelMsg: false,
      data,
    };
    sendSignalling(sendSignalData);
  },
  /* 直播客老师点击允许【申请上麦】信令 ----发起排序器
   * name: "UpperwheatSort" // 信令名
   * id:'TestSortId', //注意，这个id就是这个排序器的唯一标识
   * toID:'__all',
   * save:true, //必须保存
   * type:'useSort' //必须是useSort
   * data:{maxSort:100,  subInterval:5000}, 【注意: maxSort表示最大排序数，默认为100，如果需要不限制排序数，则maxSort设置为-1, subInterval表示订阅消息的推送间隔,单位毫秒，默认为5000ms】
   * */
  sendSignallingShowminePublish() {
    const sendSignalData = {
      name: 'UpperwheatSort',
      signalId: TestSortId,
      toId: '__all',
      isSave: true,
      type: 'useSort',
      data: { maxSort: 100, subInterval: 1000 },
    };
    sendSignalling(sendSignalData);
  },
  /* 直播客老师点击允许【申请上麦】信令----订阅排序器结果
   * name:'UpperwheatSubSortGetResult', // 信令名
   * id:'TestSubSortGetResultId',
   * toID:'__none', //必须是__none
   * save:false, //必须保存
   * type:'subSort', //必须是subSort
   * associatedMsgID:'TestSortId' //必须绑定发起排序器的id
   * data:{min:1, max:maxSort}, //数据，min:表示排序最小值，默认为1，max：表示排序最大值，默认为发起排序器时的maxSort【max不能超过maxSort，当maxSort为-1时，max为当前排序器列表总数】
   * */
  sendSignallingShowmineSubsort(id) {
    const sendSignalData = {
      name: 'UpperwheatSubSortGetResult',
      signalId: id,
      toId: '__none',
      isSave: false,
      type: 'subSort',
      associatedMsgID: TestSortId,
      data: { min: 1, max: 100 },
    };
    sendSignalling(sendSignalData);
  },
  /* 直播客老师点击允许【申请上麦】信令----取消订阅排序器结果
   * name:'UpperwheatUnsubSortGetResult', // 信令名
   * id:'TestUnsubSortGetResultId',
   * toID:'__none', //必须是__none
   * save:false, //必须不保存
   * type:'unsubSort', //必须是unsubSort
   * associatedMsgID:'TestSortId' //必须绑定发起排序器的id
   * data:{min:1, max:maxSort}, //数据，min:表示排序最小值，默认为1，max：表示排序最大值，默认为发起排序器时的maxSort【max不能超过maxSort，当maxSort为-1时，max为当前排序器列表总数】
   * */
  sendSignallingShowmineCancelsubsort(id) {
    const sendSignalData = {
      name: 'UpperwheatUnsubSortGetResult',
      signalId: id,
      toId: '__none',
      isSave: false,
      type: 'unsubSort',
      associatedMsgID: TestSortId,
      data: {},
      isDelMsg: true,
    };
    sendSignalling(sendSignalData);
  },
  /* 直播客老师点击禁止【申请上麦】信令----删除排序器
   * name:'UpperwheatSort', //必须是发起排序器的name
   * id:'TestSortId', //必须是发起排序器的id
   * toID:'__all',
   * data:{},
   * */
  sendSignallingShowmineDel() {
    const sendSignalData = {
      name: 'UpperwheatSort',
      signalId: TestSortId,
      toId: '__all',
      data: {},
      isSave: false,
      isDelMsg: true,
    };
    sendSignalling(sendSignalData);
  },
  /* 直播客老师点击同意｜不同意【上麦】信令
   * data: {
   *    isAllow: true// 是否允许上麦
   * }
   * name: "allowUpperwheat" // 信令名
   * */
  sendSignallingAllowUpperwheat(data, toId) {
    const sendSignalData = {
      name: 'allowUpperwheat',
      data,
      toId: toId || '__all',
      isSave: false,
    };
    sendSignalling(sendSignalData);
  },
  /* 直播客学生点击申请｜取消【申请上麦】信令----提交排序项：
   * name:'UpperwheatSortCommit',
   * id:'TestSortCommitId',
   * toID:'__none', //必须是__none
   * save:false, //必须不保存
   * type:'sort', //必须是sort
   * modify:0, //必须,0:添加，1：删除
   * actions:{'A':'', 'B':''}, //必须，排序项，规则如：{‘排序项名’:'排序项描述'}
   * associatedMsgID:'TestSortId' //必须绑定发起排序器的id
   * associatedUserID:'' //非必须，绑定用户id,只有在modify为0时有效,如果绑定用户id，则该用户离开时删除在该用户上【注意：这里的associatedUserID只能绑定添加排序项的自己id，一旦绑定其它人id则此项无效】
   * data:{}, //附加数据，一般业务不需要附加，特殊业务才需要
   * */
  sendSignallingApplyShowmine(id, modify, actions, userId) {
    const sendSignalData = {
      name: 'UpperwheatSortCommit',
      signalId: id,
      toId: '__none',
      isSave: false,
      type: 'sort',
      modify,
      actions,
      associatedMsgID: TestSortId,
      associatedUserID: userId || '',
      data: {},
    };
    sendSignalling(sendSignalData);
  },
  /* 发送老师通过，回复，删除提问相关信令*
    signallingName：LiveQuestions
    isDelMsg：false 为通过和回复；true为删除
    删除时：id为提问的ID时， 删除该提问及其下的所有回复；当id为回复的id时直接删除该回复
    发送：通过 data 没有信息，回复 data 中为具体的回复内容,通过、回复信令中associatedmsgID 为提问的ID
  */
  sendSignallingToLiveQuestions(isDelMsg, signalId, data) {
    const sendSignalData = {
      name: 'LiveQuestions',
      signalId,
      data,
      isDelMsg,
      isSave: false,
      expiresabs: 0,
    };
    sendSignalling(sendSignalData);
  },
};
