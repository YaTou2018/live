import { liveRoom } from '@global/roomConstants';

/*
  * .name:信令名字 , String
  * .id:信令ID , String
  * .toID:发送给谁(默认发给所有人) , String
                   __all（所有人，包括自己） ,
                   __allExceptSender （除了自己以外的所有人）,
                   userid（指定id发给某人） ,
                   __none （谁也不发，只有服务器会收到）,
                   __allSuperUsers（只发给助教和老师）,
                   __group:groupA:groupB(发送给指定组，组id不能包含冒号),
                  __groupExceptSender:groupA（发给指定组，不包括自己）
  * .data:信令携带的数据 , Json/JsonString
  * .save:信令是否保存 , Boolean
  * .expiresabs:暂时不用
  * .associatedMsgID:绑定的父级信令id , String
  * .associatedUserID:绑定的用户id , String
  * .expires:暂时无效
  * .type:扩展类型，目前只有count一种扩展类型，之后如需扩展可在此处进行相应变动 , String 【目前有：'count'代表累加器，'getCount'代表取累加器的数据】
  * .write2DB:是否存库, Boolean
  * .actions:执行的动作操作列表，用于累加器，如{A:1,B:1}，Json (直播是Array)
  * .do_not_replace:老师和助教不能同时操作，后操作的服务器直接丢弃, Boolean (目前直播才有用)
  * .modify:表示这个操作是否是修改操作，用于累加器上, Number
* */
export const sendSignalling = ({
  isDelMsg,
  name,
  signalId,
  toId = '__all',
  data,
  isSave = true,
  expiresabs,
  associatedMsgID,
  associatedUserID,
  type,
  write2DB,
  actions,
  modify,
}) => {
  let signalData = '';
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    signalData = JSON.stringify(data);
  } else if (typeof data === 'string') {
    signalData = data;
  }
  const params = {
    msgName: name,
    msgId: signalId,
    toId,
  };
  if (isDelMsg) {
    liveRoom.delMsg(params);
  } else {
    params.save = isSave;
    params.data = signalData;
    params.expiresabs = expiresabs;
    params.associatedMsgID = associatedMsgID;
    params.associatedUserID = associatedUserID;
    params.type = type;
    params.write2DB = write2DB;
    params.actions = actions;
    params.modify = modify;
    liveRoom.pubMsg(params);
  }
};

/* 发送聊天消息
    * @method sendTextMessage
    * params[message:string(require) ,toId:string]
        isToSender: 注意只有发给指定用户/特殊用户且自己需要收到时才传该参数
    */
export const sendTextMessage = (message, toId, isToSender = false) => {
  function escapeHtml(str) {
    // 特殊字符转义成html
    const arrEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&', quot: '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function temp(all, t) {
      return arrEntities[t];
    });
  }
  if (message) {
    let messageTemp = message;
    if (typeof messageTemp === 'string') {
      messageTemp = window.L && window.L.Utils.toJsonParse(messageTemp);
    }
    let textMsg;
    if (messageTemp && typeof messageTemp === 'object') {
      textMsg = escapeHtml(messageTemp.msg);
      delete messageTemp.msg;
      // message = JSON.stringify(message);
    }
    liveRoom.sendMessage(textMsg, toId || '__all', messageTemp, { isToSender });
  }
};

/* 改变用户属性
 * @params id:用户id , String/Json 【注：如果id是String类型则表述某个人的id,如果id是Json类型，则{ids:[user1Id,user2Id]}表示批量改变某批人的用户属性，ids的value为数组（放要改变者的userid）,若{roles:[role1,role2]}表示改变某些角色的用户属性，roles的value为数组（放要改变用户属性的角色）】
 * @params toID:发送给谁( __all , __allExceptSender , userid , __none ,__allSuperUsers) , String
 * @params properties:需要改变的用户属性 , Json
 * 备注：指定用户会收到事件room-userproperty-changed */
export const setUserProperty = (id, properties, toId = '__all') => {
  liveRoom.changeUserProperty(id, toId, properties);
};
