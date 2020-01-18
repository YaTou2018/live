import { liveRoom, EVENT_TYPE, ROOM_ROLE } from '@global/roomConstants';
import { YsGlobal } from '@global/handleGlobal';
import store from '@app/store';
import UserService from '@global/services/UserService';
import { setChatNoticeBoard, addChatList, setChatListFilter, setLiveAllNoChatSpeaking } from '../state/actions';
import { getSendTime } from '../utils';
import { roleMap } from '../constent';
const { chatInput, errorNotice } = YsGlobal.languageInfo.chat;
class ChatContainerListener {
  constructor() {
    this.instance = null;
    this.listernerBackupid = new Date();
    this.mySelf = liveRoom.getMySelf();
    this.store = store;
    this.addChatTimer = '';

    this.roomConnected();
    this.roomPubmsg();
    this.roomDelmsg();
    this.roomMsgList();
    this.roomParticipantJoin();
    this.roomParticipantLeave();
    this.roomTextMessage();
    // this.textMessageFilter();
  }

  /**
   *  roomlistener实例
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new ChatContainerListener();
    }
    return this.instance;
  }

  // 监听房间连接事件
  roomConnected() {
    liveRoom.addEventListener(
      EVENT_TYPE.roomConnected,
      () => {
        this.mySelf = liveRoom.getMySelf();
      },
      this.listernerBackupid,
    );
  }

  // 重置用户属性
  userListData(liveAllNoChatSpeaking) {
    if (YsGlobal.roomInfo.isLiveRoom || [0, 1].includes(this.mySelf.role)) return;
    const { userList } = this.store.getState().user;
    if (liveAllNoChatSpeaking) {
      userList.filter(it => it.role !== 0 && it.role !== 1 && !it.disablechat).forEach(user => UserService.userBanSpeak(user));
    } else {
      userList.filter(it => it.role !== 0 && it.role !== 1 && it.disablechat).forEach(user => UserService.userBanSpeak(user));
    }
  }

  // 监听pubmsg
  roomPubmsg() {
    liveRoom.addEventListener(
      EVENT_TYPE.roomPubmsg,
      param => {
        const time = getSendTime();
        const pubmsgData = param.message;
        switch (pubmsgData.name) {
          // 公告
          case 'LiveNoticeBoard': {
            // if (pubmsgData.roomtype !== undefined && pubmsgData.roomtype === 11)
            //   return;
            //   给公告赋值
            this.store.dispatch(setChatNoticeBoard(pubmsgData.data.text));
            break;
          }
          // 全体禁言
          case 'LiveAllNoChatSpeaking': {
            setLiveAllNoChatSpeaking(pubmsgData.data.isAllBanSpeak);
            this.userListData(pubmsgData.data.isAllBanSpeak);
            if ((pubmsgData.toID !== '__all' && pubmsgData.toID !== this.myId) || (!YsGlobal.roomInfo.isLiveRoom && this.mySelf.role === ROOM_ROLE.STUDENT)) {
              break;
            }
            let test = chatInput.bannedToPost;
            if (pubmsgData.toID === this.mySelf.id) {
              test = chatInput.forbiddenToChat;
            }
            const chatObj = {
              time,
              msgtype: 'notice',
              data: {
                test,
              },
              id: new Date().getTime(),
            };
            this.addChatList(chatObj);
            break;
          }
          case 'LiveAllNoAudio': {
            const it = this.mySelf;
            if (!pubmsgData.data.liveAllNoAudio && ![0, 1].includes(it.role) && it.hasaudio && [1, 3].includes(it.publishstate)) {
              UserService.changeUserAudio(it);
            } else if (pubmsgData.data.liveAllNoAudio && ![0, 1].includes(it.role) && it.hasaudio && [2, 4].includes(it.publishstate)) {
              UserService.changeUserAudio(it);
            }
            break;
          }
          // 送花
          case 'LiveGivigGifts': {
            const tempObj = {
              time,
              msgtype: 'notice',
              type: 'flowers',
              data: {
                test: `${pubmsgData.data.nickname}${chatInput.toTeacher}`,
                num: pubmsgData.data.num,
              },
              id: new Date().getTime(),
              fromID: pubmsgData.fromID,
            };
            if (
              store.getState().chat.filterCondition === this.mySelf.id &&
              store.getState().chat.filterCondition !== pubmsgData.fromID &&
              this.mySelf.role === 2
            ) {
              return;
            }
            this.addChatList(tempObj);
            break;
          }
          // 获奖消息
          case 'LiveLuckDrawResult': {
            const { winners = [] } = pubmsgData.data;
            const _winners = Array.isArray(winners) ? winners : winners.winners;
            if (_winners.find(it => it.buddyid === this.mySelf.id)) {
              const test = chatInput.congratulateWinner;
              const chatObj = {
                time,
                msgtype: 'notice',
                data: {
                  test,
                },
                id: new Date().getTime(),
              };
              this.addChatList(chatObj);
            }

            break;
          }
          case 'GetUserMediaError': {
            const data = pubmsgData.data || {};
            const chatObj = {
              time,
              msgtype: 'notice',
              data: {
                test: errorNotice.getMediaErrorBefore + data.name + errorNotice.getMediaErrorBack,
              },
              id: new Date().getTime(),
            };
            this.addChatList(chatObj);
            break;
          }
          default:
            break;
        }
      },
      this.listernerBackupid,
    );
  }

  // 监听delmsg事件
  roomDelmsg() {
    liveRoom.addEventListener(
      EVENT_TYPE.roomDelmsg,
      param => {
        const time = getSendTime();
        const delmsgData = param.message;
        let chatObj;
        switch (delmsgData.name) {
          // 全体禁言
          case 'LiveAllNoChatSpeaking':
            setLiveAllNoChatSpeaking(false);
            this.userListData(false);
            if (!YsGlobal.roomInfo.isLiveRoom && this.mySelf.role === ROOM_ROLE.STUDENT) {
              break;
            }
            chatObj = {
              time,
              msgtype: 'notice',
              isme: this.mySelf,
              data: {
                test: chatInput.LiftAllGagOrders,
              },
              id: new Date().getTime(),
            };
            this.addChatList(chatObj);
            break;
          default:
            break;
        }
      },
      this.listernerBackupid,
    );
  }

  roomMsgList() {
    liveRoom.addEventListener(
      'room-msglist',
      param => {
        const roomMsgList = param.data;
        roomMsgList.forEach(value => {
          switch (value.name) {
            case 'LiveNoticeBoard': {
              this.store.dispatch(setChatNoticeBoard(value.data.text));
              break;
            }
            case 'LiveAllNoChatSpeaking': {
              setLiveAllNoChatSpeaking(value.data.isAllBanSpeak);
              this.userListData(value.data.isAllBanSpeak);
              break;
            }
            default:
              break;
          }
        });
      },
      this.listernerBackupid,
    );
  }

  // 参与者加入房间事件
  roomParticipantJoin() {
    liveRoom.addEventListener(
      EVENT_TYPE.roomParticipantJoin,
      param => {
        const { user } = param;
        if (+user.role === 4) return; // 不是巡检员,才提醒
        const time = getSendTime();
        let test = chatInput.joinLive;
        const roleName = roleMap[user.role] ? `(${roleMap[user.role]}) ` : ' ';
        test = `${user.nickname} ${roleName}${test}`;
        // if (+user.role === 0) this.teacherId = user.id;
        const chatObj = {
          time,
          msgtype: 'notice',
          data: { test },
          id: new Date().getTime(),
        };
        this.addChatList(chatObj);
      },
      this.listernerBackupid,
    );
  }

  // 用户离开事件
  roomParticipantLeave() {
    liveRoom.addEventListener(
      EVENT_TYPE.roomParticipantLeave,
      param => {
        const { user } = param;
        if (+user.role === 4) return; // 不是巡检员,才提醒
        const time = getSendTime();
        let test = chatInput.leaveLive;
        const roleName = roleMap[user.role] ? `(${roleMap[user.role]}) ` : ' ';
        test = `${user.nickname} ${roleName}${test}`;

        const chatObj = {
          time,
          msgtype: 'notice',
          data: { test },
          id: new Date().getTime(),
        };
        this.addChatList(chatObj);
      },
      this.listernerBackupid,
    );
  }

  // 聊天消息事件
  roomTextMessage() {
    liveRoom.addEventListener(
      EVENT_TYPE.roomTextMessage,
      param => {
        // 判断是否是聊天中的消息
        if (!param || param.message.type !== 0) return;

        const { sender } = param.message;
        const time = getSendTime();
        // 判断当前发消息人是不是老师或者助教
        const isTeacher = +sender.role === 0 || +sender.role === 1;

        // 如果指定了接收人(toUserID) 那么只有发送人和接收人能受到这个消息
        const isHasTouserId = Boolean(param.message.toUserID && param.message.toUserID.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''));
        if (isHasTouserId && param.message.toUserID !== this.mySelf.id && sender.id !== this.mySelf.id && !isTeacher) return;
        // 如果是私聊 处理下名字
        const toWho = `${param.message.sender.id === this.mySelf.id ? chatInput.mine : sender.nickname} ${chatInput.dui} ${
          param.message.sender.id === this.mySelf.id ? param.message.toUserNickname : chatInput.you
        } ${chatInput.said}:`;
        const chatData = {
          time, // 时间
          strmsg: param.message.msg,
          who: !isHasTouserId ? sender.nickname : toWho, // 昵称 或谁对谁说
          fromName: sender.nickname, // 发消息人的昵称
          toUserID: param.message.toUserID,
          chatType: param.message.type, // 消息类型 暂时没有过
          id: param.message.id || new Date().getTime(), // 消息id
          isMe: sender.id === this.mySelf.id, // 是不是自己发的
          roleNum: sender.role, // 发消息的人的角色
          // isTeacher: isTeacher, // 是不是老师
          fromID: sender.id, // 发消息人的id
          msgtype: param.message.msgtype || 'text', // 消息类型
        };

        YsGlobal.chatList.push(chatData);
        if (YsGlobal.roomInfo.isLiveRoom) {
          this.handleAddChatList(YsGlobal.chatList);
        } else {
          this.addChatList(chatData);
        }
      },
      this.listernerBackupid,
    );
  }

  handleAddChatList() {
    // 50毫秒内处理一批聊天消息，利用延时器50毫秒后空出主线程给其他事件
    if (this.addChatTimer) {
      return;
    }
    const addTimer = YsGlobal.isMobile ? 100 : 50;
    this.addChatTimer = setTimeout(() => {
      this.addChatList(YsGlobal.chatList);
      YsGlobal.chatList = [];
      clearTimeout(this.addChatTimer);
      this.addChatTimer = null;
    }, addTimer);
  }

  // 监听从输入框过来的过滤消息事件
  textMessageFilter() {
    liveRoom.addEventListener(
      'textMessageFilter',
      param => {
        const { teacherId } = store.getState().user;
        // 0-所有，1-自己，2-老师
        let filterId = 'none';
        if (param === 1) {
          filterId = this.mySelf.id;
        }
        if (param === 2) {
          filterId = teacherId;
        }
        this.store.dispatch(setChatListFilter(filterId));
      },
      this.listernerBackupid,
    );
  }

  // 将收到的消息放到消息列表中
  addChatList(chatData) {
    // // 更新滚动条位置
    // liveRoom.dispatchEvent({ type: "chatScrollChange" });
    this.store.dispatch(addChatList(chatData));
  }

  // 清除监听事件
  removeBackupListerner() {
    liveRoom.removeBackupListerner(this.listernerBackupid);
  }
}

export default ChatContainerListener;
