import { YsGlobal } from '@global/handleGlobal';

const { chat } = YsGlobal.languageInfo;
const { chatContent } = chat;

// 消息列表中 对应角色
export const roleMap = {
  0: chatContent.speaker,
  1: chatContent.assistant,
  2: '', // 学员
  3: '', // 直播用户
  4: '', // 巡检员
  5: chatContent.classTeacher,
  10: chatContent.system,
  11: chatContent.enterprise,
  12: chatContent.admin,
  '-1': chatContent.playBack,
};

// 聊天区无限制接收最大聊天数量。
export const chatMaxCount = 300;

// 表情对应的图片
export const emoticonImg = {
  '[em_1]': '😀',
  '[em_2]': '😃',
  '[em_3]': '😏',
  '[em_4]': '😒',
  '[em_5]': '😢',
  '[em_6]': '😭',
  '[em_7]': '😙',
  '[em_8]': '😘',
};
export const emoticonImg2 = {
  '😀': '[em_1]',
  '😃': '[em_2]',
  '😏': '[em_3]',
  '😒': '[em_4]',
  '😢': '[em_5]',
  '😭': '[em_6]',
  '😙': '[em_7]',
  '😘': '[em_8]',
};
export const emotReg = /[😀😃😏😒😢😭😙😘]{1}/g;
export const EmoticonArray = {
  调皮: '[em_1]',
  开心: '[em_2]',
  得意: '[em_3]',
  撇嘴: '[em_4]',
  难过: '[em_5]',
  流泪: '[em_6]',
  亲亲: '[em_7]',
  么么哒: '[em_8]',
};

// 发送图片的主机地址
export const getDocAddress = () => window.WBGlobal.nowUseDocAddress;

export const MsgType = {
  roomPubmsg: {
    // room-pubmsg pubMsg消息事件
    value: 'room-pubmsg',
    writable: false,
    enumerable: true,
  },
  roomDelmsg: {
    // room-delmsg delMsg消息事件
    value: 'room-delmsg',
    writable: false,
    enumerable: true,
  },
  roomParticipantJoin: {
    // room-participant_join 参与者加入房间事件
    value: 'room-participant_join',
    writable: false,
    enumerable: true,
  },
  roomParticipantLeave: {
    // room-participant_leave  参与者离开房间事件
    value: 'room-participant_leave',
    writable: false,
    enumerable: true,
  },

  roomTextMessage: {
    //	room-text-message 聊天消息事件
    value: 'room-text-message',
    writable: false,
    enumerable: true,
  },
};
