import { uuidv4 } from '@utils';
import { sendSignalling } from '../../utils/sign';
import { LiveRoomSignalling } from './LiveRoomSignalling';

class Signalling {
  /**
   * @param {Object} data 信令数据
   * @param {Boolean}} isDelMsg 是否是删除信令
   */
  sendVideoMark(data, isDelMsg = false) {
    const signallingName = 'VideoWhiteboard';
    const toId = '__all';
    const associatedMsgID = data.assID || '';
    const id = 'VideoWhiteboard';
    sendSignalling({
      isDelMsg,
      name: signallingName,
      signalId: id,
      toId,
      data: data || {},
      isSave: true,
      associatedMsgID,
    });
  }

  /**
   * 小班课发布答题器
   */
  sendAnswerCreated(isDelMsg, data, serial) {
    const signallingName = 'Answer';
    const toID = '__all';
    const associatedMsgID = data.assID || '';
    let id = `answer_${serial + uuidv4()}`;
    if (isDelMsg || data.answerId) id = data.answerId;
    sendSignalling({
      isDelMsg,
      name: signallingName,
      signalId: id,
      toId: toID,
      data: { ...data, answerId: id },
      isSave: true,
      associatedMsgID,
      write2DB: true,
      type: 'useCount',
    });
  }

  /**
   * 小班课答题器提交答案
   */
  sendAnswerCommit(data, options, id, isUpdate) {
    const signallingName = 'AnswerCommit';
    const toID = '__none';
    sendSignalling({
      isDelMsg: false,
      name: signallingName,
      signalId: id,
      toId: toID,
      data,
      modify: Number(!!isUpdate),
      isSave: true,
      type: 'count',
      actions: options,
      write2DB: true,
      associatedMsgID: id,
    });
  }

  /**
   * 小班课答题器获取答题结果
   */
  sendAnswerResult(id, toID) {
    const signallingName = 'AnswerGetResult';
    sendSignalling({
      isDelMsg: false,
      name: signallingName,
      signalId: id,
      toId: toID,
      data: {},
      isSave: false,
      type: 'getCount',
      associatedMsgID: id,
    });
  }

  /**
   * 小班课答题器公布答案
   */
  sendAnswerPublic(data, id, isDelMsg) {
    const signallingName = 'AnswerPublicResult';
    sendSignalling({
      isDelMsg,
      name: signallingName,
      signalId: 'AnswerPublicResult',
      toId: '__all',
      data,
      isSave: true,
      associatedMsgID: id,
    });
  }

  /**
   * 更新服务器时间
   */
  sendSignallingFromUpdateTime(toParticipantID) {
    sendSignalling({
      name: 'UpdateTime',
      signalId: 'UpdateTime',
      toId: toParticipantID,
      isSave: false,
    });
  }

  /* 发送开始上课结束上课信令 */
  sendSignallingToClassBegin(isDelMsg, isSave) {
    const sendSignalData = {
      isDelMsg,
      isSave,
      name: 'ClassBegin',
      signalId: 'ClassBegin',
      data: {
        recordchat: true,
      },
    };
    sendSignalling(sendSignalData);
  }

  /* 清除所有信令消息 */
  sendSignallingToDelAll() {
    const sendSignalData = {
      name: '__AllAll',
      signalId: '__AllAll',
      isDelMsg: true,
      toId: '__none',
    };
    sendSignalling(sendSignalData);
  }

  /* 禁言信令 */
  sendSignallingToAllNoChatSpeaking(isDelMsg, data) {
    const sendSignalData = {
      name: 'LiveAllNoChatSpeaking',
      signalId: 'LiveAllNoChatSpeaking',
      data,
      isDelMsg,
    };
    sendSignalling(sendSignalData);
  }

  /* 全体静音 */
  sendSignallingToAllNoAudio(data) {
    const sendSignalData = {
      name: 'LiveAllNoAudio',
      signalId: 'LiveAllNoAudio',
      toId: '__all',
      data,
      isSave: false,
    };
    sendSignalling(sendSignalData);
  }

  /* 发送文档上传或者删除相关的信令DocumentChange
   *@method  sendSignallingFromDocumentChange */
  sendSignallingFromDocumentChange(data, toID) {
    // if (!CoreController.handler.getAppPermissions('sendSignallingFromDocumentChange')) {
    //   return;
    // }
    const name = 'DocumentChange';
    const id = name;
    const isDelMsg = false;
    const sendSignalData = {
      name,
      signalId: id,
      data,
      isDelMsg,
      toId: toID || '__allExceptSender',
      isSave: true,
    };
    sendSignalling(sendSignalData);
  }

  /* 发送远程控制信令 */
  sendSignallingFromRemoteControl(toId) {
    const sendSignalData = {
      name: 'RemoteControl',
      toId,
      isSave: false,
    };
    sendSignalling(sendSignalData);
  }

  /* 远程设备管理 */
  sendSignallingRemoteControlDeviceManagement(toId, data) {
    const sendSignalData = {
      name: 'remoteControlDeviceManagement',
      toId,
      data,
      isSave: false,
    };
    sendSignalling(sendSignalData);
  }

  /* 获取远程设备 */
  sendSignallingGetRemoteControlDevice(toId) {
    const sendSignalData = {
      name: 'getRemoteControlDevice',
      toId,
      isSave: false,
    };
    sendSignalling(sendSignalData);
  }

  /* 设置远程设备 */
  sendSignallingSetRemoteControlDevice(toId, data) {
    const sendSignalData = {
      name: 'setRemoteControlDevice',
      toId,
      data,
      isSave: false,
    };
    sendSignalling(sendSignalData);
  }

  /* 优选网络 */
  sendSignallingUserAreaSelection(toId, data) {
    const sendSignalData = {
      name: 'UserAreaSelection',
      toId,
      data,
      isSave: false,
    };
    sendSignalling(sendSignalData);
  }

  /* 课件服务器cdn */
  sendSignallingUseCndLine(toId, data) {
    const sendSignalData = {
      name: 'UseCndLine',
      toId,
      data,
      isSave: false,
    };
    sendSignalling(sendSignalData);
  }

  /* 设置房间布局
   * data:｛roomLayout : 'aroundLayout'-默认布局/'videoLayout'-视频布局｝
   * */
  sendSignallingSetRoomLayout(data, isDelMsg) {
    const sendSignalData = {
      name: 'SetRoomLayout',
      toId: '__allExceptSender',
      data,
      isDelMsg,
    };
    sendSignalling(sendSignalData);
  }

  /* 视频框拖拽的动作相关信令
   * data: {
   *   userId: id,// 用户id
   *   percentTop: dragEleTop, y轴百分比
   *   percentLeft: dragEleLeft, x轴百分比
   *   isDrag: true, // 是否拖拽了
   * }
   *  */
  sendSignallingVideoDrag(data, userId, isDelMsg) {
    const sendSignalData = {
      name: 'VideoDrag',
      toId: '__allExceptSender',
      data,
      isDelMsg,
      signalId: `VideoDrag_${userId}`,
      associatedUserID: userId,
    };
    sendSignalling(sendSignalData);
  }

  /* 视频框拉伸的相关信令
   * data: {
   *   userId: id,// 用户id
   *   scale: 1, type:Number 视频拉伸的比例
   * }
   * */
  sendSignallingVideoChangeSize(data) {
    const sendSignalData = {
      name: 'VideoChangeSize',
      toId: '__allExceptSender',
      data,
      signalId: `VideoSize_${data.userId}`,
      associatedMsgID: `VideoDrag_${data.userId}`,
    };
    sendSignalling(sendSignalData);
  }

  /* 视频双击全屏
   * data: {
   *    doubleId:"2576d388-c517-20a6-c596-2b451802d0a4" // 双击视频的用户id
   * }
   * name: "doubleClickVideo" // 信令名
   * */
  sendSignallingDoubleClickVideo(data, userId, isDelMsg) {
    const sendSignalData = {
      name: 'doubleClickVideo',
      toId: '__allExceptSender',
      data,
      associatedUserID: userId,
      isDelMsg,
    };
    sendSignalling(sendSignalData);
  }

  /* 通知老师获取音视频失败
   * data: {
   *    errorType:1-音视频都失败,2-音视频都失败,3-音视频都失败
   *    name,
   * }
   * */
  sendSignallingGetUserMediaError(data, toId) {
    const sendSignalData = {
      name: 'GetUserMediaError',
      toId,
      data,
      isSave: false,
    };
    sendSignalling(sendSignalData);
  }

  /* 设置双师房间布局：老师拖拽视频布局相关信令
   *  data: { one2one: nested(嵌套，画中画) ｜ abreast(两个视频同级别并列) }
   * */
  sendSignallingSetone2oneVideoLayout(type, isDelMsg) {
    const sendSignalData = {
      name: 'one2oneVideoSwitchLayout',
      toId: '__allExceptSender',
      data: { one2one: type },
      isDelMsg,
    };
    sendSignalling(sendSignalData);
  }
}

Object.assign(Signalling.prototype, LiveRoomSignalling);

export default new Signalling();
