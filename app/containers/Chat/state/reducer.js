import { YsGlobal } from '@global/handleGlobal';
import {
  SET_CHAT_INNDEX,
  SET_NOTALKING,
  PRIVATA_LIST,
  ADD_CHAT_LIST,
  CLEAR_CHAT_LIST,
  SET_CHAT_LIST_FILTER,
  SET_CHAT_NOTICE_BOARD,
  SET_QUESTION_LIST,
  DEL_QUESTION_LIST,
  SET_QUESTION_LIST_FILTER,
  SET_NAME_LIST_ISSHOW,
  SET_FONT_SIZE,
  SET_FONT_SELECT_SHOW,
  SET_NOAUDIO,
} from './actions-type';
import { chatMaxCount } from '../constent';

const { chatInput } = YsGlobal.languageInfo.chat;

/* 默认数据 */
const initialState = {
  selectChat: 0, // 0 : 聊天 ， 1 ： 提问
  liveAllNoChatSpeaking: false, // 禁言
  liveAllNoAudio: false, // 禁言

  // 公告内容 有值就显示 为空隐藏
  liveNoticeBoard: '',
  // 聊天消息列表  根据这个数据渲染数据
  liveChatList: [],
  // 筛选消息列表  老师id或者 自己的id  没有筛选条件为none
  filterCondition: 'none',

  // 存放所有问题的id， 用来控制顺序  提问需求： 一个问题只能显示一条  将最新更新的状态显示在最下面 上面的消息删除
  questionListArr: [],
  // 存放所有问题的对象， 保存消息中的所有数据
  questionListObj: {},

  // 筛选提问列表  老师id或者 自己的id  没有筛选条件为none
  filterQuestion: 'none',

  // 私聊数据
  privateData: {
    selectUserID: '', // 对谁说 id
    selectUserNickname: '', // 对谁说 name
    userListArr: [], // 所有私聊用户
    privatePageIsShow: false,
  },
  // 字体数据
  fontData: {
    isShowFontList: false,
    fontList: [
      {
        fontName: chatInput.fontNameNor,
        fontSize: 14,
      },
      {
        fontName: chatInput.fontNameMid,
        fontSize: 16,
      },
      {
        fontName: chatInput.fontNameLar,
        fontSize: 18,
      },
    ],
    nowFont: {
      fontName: chatInput.fontNameNor,
      fontSize: 14,
    },
  },
};

// 这是reducer
const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_FONT_SELECT_SHOW:
      return {
        ...state,
        fontData: {
          ...state.fontData,
          isShowFontList: !state.fontData.isShowFontList,
        },
      };
    case SET_FONT_SIZE:
      return {
        ...state,
        fontData: {
          ...state.fontData,
          nowFont: state.fontData.fontList.filter(item => item.fontSize === payload.data)[0],
          isShowFontList: false,
        },
      };
    case SET_CHAT_INNDEX:
      return {
        ...state,
        selectChat: payload.data,
      };
    case SET_NOTALKING:
      return {
        ...state,
        liveAllNoChatSpeaking: payload.data,
      };
    case SET_NOAUDIO:
      return {
        ...state,
        liveAllNoAudio: payload.data,
      };
    case PRIVATA_LIST:
      return {
        ...state,
        privateData: {
          ...state.privateData,
          ...payload,
        },
      };

    case ADD_CHAT_LIST: {
      let liveChatList = [...state.liveChatList, payload.data].flat();
      // 如果超过最大人数，就截取最后250条
      if (liveChatList.length >= chatMaxCount + 50) {
        liveChatList = liveChatList.slice(-chatMaxCount + 50);
      }
      return {
        ...state,
        liveChatList,
      };
    }

    case CLEAR_CHAT_LIST: {
      return {
        ...state,
        liveChatList: [],
      };
    }

    case SET_CHAT_LIST_FILTER:
      return {
        ...state,
        filterCondition: payload.data,
      };
    case SET_CHAT_NOTICE_BOARD:
      return {
        ...state,
        liveNoticeBoard: payload.data,
      };

    // 更新提问列表 重复覆盖
    case SET_QUESTION_LIST: {
      const [chatId, msgObj] = payload.data;
      let { questionListArr } = state;
      const { questionListObj } = state;
      // questionListArr = questionListArr.filter(item => item !== chatId);
      questionListArr = questionListArr.filter(item => {
        if (payload.data[1].questionMsg == '已开启仅看自己消息' && questionListObj[item].roleNum === 0) {
          return item;
        }
        if (item !== chatId) {
          return item;
        }
      });
      questionListArr.push(chatId);
      questionListObj[chatId] = msgObj;
      return {
        ...state,
        questionListArr: [...questionListArr],
        questionListObj: { ...questionListObj },
      };
    }

    //   删除指定id的提问
    case DEL_QUESTION_LIST: {
      const { questionListArr, questionListObj } = state;
      const questionIndex = questionListArr.indexOf(payload.data);
      if (questionListObj[payload.data]) {
        delete questionListObj[payload.data];
      }
      if (questionIndex !== -1) {
        questionListArr.splice(questionIndex, 1);
      }
      return {
        ...state,
        questionListArr: [...questionListArr],
        questionListObj: { ...questionListObj },
      };
    }

    // 提问列表的筛选条件
    case SET_QUESTION_LIST_FILTER:
      return {
        ...state,
        filterQuestion: payload.data,
      };

    // 对谁私聊名字列表
    case SET_NAME_LIST_ISSHOW:
      return {
        ...state,
        privateData: {
          ...state.privateData,
          privatePageIsShow: payload.data,
        },
      };
    default:
      return state;
  }
};
export default reducer;
