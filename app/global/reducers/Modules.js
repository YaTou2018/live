import {
  SET_LUCKYSTATUS,
  SET_LUCKYDATA,
  SET_VOTESTATUS,
  SET_VOTEDATA,
  SET_ANSWERSTATUS,
  SET_ANSWERDATA,
  SET_SHARESTATUS,
  SET_SHAREDATA,
  SET_CALLROLLSTATUS,
  SET_CALLROLLDATA,
  SET_ANNOUNCEMENTSTATUS,
  SET_ANNOUNCEMENTDATA,
  SET_LUCKYCOUNTNUM,
  SET_UPDATAPICTURE,
  SET_MP4_FULL,
  SET_MOBILE_PAGE_ZZC,
  INIT_MODULES_STATE,
  SET_APPLY_WHEAT,
  SET_MCRO_PLAY,
} from '../actionTypes/Modules';

const initialState = {
  luckyDraw: {
    luckyState: '',
    luckyData: {
      winners: [],
      luckdrawNum: 1,
      isReLotterydraw: 1,
    },
    countdownNum: -1,
  },
  vote: {
    voteState: '', // isShowVoteRecord:显示历史投票列表 isSetVoteInfo: 显示设置投票信息框  voting: 投票中  isShowVoteResult: 显示投票结果
    voteData: {
      id: '', // 每次投票的id
      cTime: '', // 发起投票的时间
      sendVoteUserId: '', // 发起投票的人的id
      owner: '', // 发起投票的人的名字
      subject: '', // 每次投票的主题
      desc: '', // 每次投票的描述
      pattern: '', // 这次投票是单选或多选，multi-多选，radio-单选
      options: [], // 选项
      voteRecordList: [], // 记录列表
    },
  },
  deskTopSharing: {
    shareState: '',
    shareData: {},
  },
  callRoll: {
    callRollState: '', // call: 显示点名窗口, calling: 点名中, signin: 签到, disable: 不显示
    callRollData: {
      currentCRID: null, // 当前点名ID
      timeLenIndex: 0, // 当前点名时间下标 0->1分钟，1->3分钟，2->5分钟，3->10分钟，4->30分钟
      callRollList: [],
      startTime: 0, // 点名开始时间
    },
  },
  announcement: {
    announcementState: '',
    announcementData: {},
  },
  updataPicture: {
    isShowUpPic: false,
  },
  answer: {
    answerState: '', // creating: 创建答题, stoped: 结束答题, publicResult: 公布结果（学生用）, answer: 答题中, answerSelecting: 答题中（学生选择答案）, disable: 不显示
    answerData: {},
  },
  isFullScreenVideo: false,
  isMp4AllFull: false,
  isShowOutLive: false,
  applyWheat: {
    isWheatbtn: false,
  },
  isPlayMcro: false,
};

export default function reducer(state = initialState, action) {
  const { type, payload } = action;
  const newState = JSON.parse(JSON.stringify(state));
  switch (type) {
    case SET_MCRO_PLAY:
      // 麦克风音频播放
      newState.isPlayMcro = payload;
      break;
    case SET_APPLY_WHEAT:
      // 判断是否为上麦按钮
      newState.applyWheat.isWheatbtn = payload;
      break;
    case SET_LUCKYSTATUS:
      newState.luckyDraw.luckyState = payload;
      break;
    case SET_LUCKYCOUNTNUM:
      newState.luckyDraw.countdownNum = payload;
      break;
    case SET_LUCKYDATA:
      newState.luckyDraw.luckyData = { ...payload };
      break;
    case SET_VOTESTATUS:
      newState.vote.voteState = payload;
      break;
    case SET_VOTEDATA:
      newState.vote.voteData = {
        ...newState.vote.voteData,
        ...payload,
      };
      break;
    case SET_ANSWERSTATUS:
      newState.answer.answerState = payload;
      break;
    case SET_ANSWERDATA:
      newState.answer.answerData = {
        ...newState.answer.answerData,
        ...payload,
      };
      break;
    case SET_SHARESTATUS:
      newState.deskTopSharing.shareState = payload;
      break;
    case SET_SHAREDATA:
      newState.deskTopSharing.shareData = { ...payload };
      break;
    case SET_CALLROLLSTATUS:
      // 点名进行中存在的数据
      newState.callRoll.callRollState = payload;
      break;
    case SET_CALLROLLDATA:
      // 点名进行中存在的数据
      newState.callRoll.callRollData = {
        ...newState.callRoll.callRollData,
        ...payload,
      };
      break;
    case SET_ANNOUNCEMENTSTATUS:
      newState.announcement.announcementState = payload;
      break;
    case SET_ANNOUNCEMENTDATA:
      newState.announcement.announcementData = { ...payload };
      break;
    // 图片上传
    case SET_UPDATAPICTURE:
      newState.updataPicture.isShowUpPic = payload;
      break;
    case SET_MP4_FULL:
      newState.isMp4AllFull = payload;
      break;
    case SET_MOBILE_PAGE_ZZC:
      newState.isShowOutLive = payload;
      break;
    case INIT_MODULES_STATE:
      return initialState;
    default:
      break;
  }
  return newState;
}
