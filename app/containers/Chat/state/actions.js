import store from '@app/store';
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

/* 显示隐藏字体下拉框 */
export const setChangeshowFontFn = () =>
  store.dispatch({
    type: SET_FONT_SELECT_SHOW,
  });
/* 调整字体大小 */
export const setFontSizeDis = data =>
  store.dispatch({
    type: SET_FONT_SIZE,
    payload: { data },
  });

/* 是否显示私聊名单列表 */
export const setnameListIsShow = data =>
  store.dispatch({
    type: SET_NAME_LIST_ISSHOW,
    payload: {
      data,
    },
  });

/* 修改聊天/提问 索引值 */
export const setChatIndex = data =>
  store.dispatch({
    type: SET_CHAT_INNDEX,
    payload: {
      data,
    },
  });

/* 禁言 */
export const setLiveAllNoChatSpeaking = data =>
  store.dispatch({
    type: SET_NOTALKING,
    payload: {
      data,
    },
  });

/* 静音 */
export const setLiveAllNoAudio = data =>
  store.dispatch({
    type: SET_NOAUDIO,
    payload: {
      data,
    },
  });

/* 设置私聊信息 */
export const setPrivata = data =>
  store.dispatch({
    type: PRIVATA_LIST,
    payload: {
      ...data,
    },
  });

/* 添加聊天消息列表 */
export const addChatList = data => ({
  type: ADD_CHAT_LIST,
  payload: {
    data,
  },
});

/* 清空聊天消息列表 */
export const clearChatList = data => ({
  type: CLEAR_CHAT_LIST,
  payload: {
    data,
  },
});
/* 修改聊天列表筛选条件 */
export const setChatListFilter = data => {
  store.dispatch({
    type: SET_CHAT_LIST_FILTER,
    payload: {
      data,
    },
  });
};

/* 设置公告消息 */
export const setChatNoticeBoard = data => ({
  type: SET_CHAT_NOTICE_BOARD,
  payload: {
    data,
  },
});

/* 修改提问列表(只放id，用来控制顺序) */
export const setQuestionList = data => ({
  type: SET_QUESTION_LIST,
  payload: {
    data,
  },
});

/* 删除提问列表(只放id，用来控制顺序) */
export const delQuestionList = data => ({
  type: DEL_QUESTION_LIST,
  payload: {
    data,
  },
});

/* 修改提问列表筛选条件 */
export const setQuestionListFilter = data => ({
  type: SET_QUESTION_LIST_FILTER,
  payload: {
    data,
  },
});
