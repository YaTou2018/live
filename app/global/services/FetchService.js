import { post, get } from '@utils/request';
import { getServiceInfo } from '@utils/url';
import { liveRoom } from '@global/roomConstants';
import Signalling from './SignallingService';
import { YsGlobal } from '../handleGlobal';

class FetchService {
  constructor() {
    this.instance = null;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchService();
    }
    return this.instance;
  }

  roomStart() {
    const url = `${YsGlobal.serviceInfo.webRequest}/ClientAPI/roomstart?ts=${new Date().getTime()}`;
    const { serial, companyid } = YsGlobal.roomInfo;
    const data = {
      serial,
      companyid,
    };
    Signalling.sendSignallingToClassBegin(false, true);
    return post(url, data);
  }

  roomOver() {
    const url = `${YsGlobal.serviceInfo.webRequest}/ClientAPI/roomover?ts=${new Date().getTime()}`;
    const { serial, companyid } = YsGlobal.roomInfo;
    const data = {
      serial,
      companyid,
      act: 3, // 删除会议
    };
    Signalling.sendSignallingToClassBegin(true);
    post(url, data);
  }

  /* 送花 */
  sendFlowers(ajaxData) {
    const url = `https://1069568596212347.cn-beijing.fc.aliyuncs.com/2016-08-15/proxy/${YsGlobal.serviceInfo.aliUrl}/sendflowers/`;
    const JSON_HEADER_CONF = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    return post(url, ajaxData, 'object', JSON_HEADER_CONF);
  }

  /** 学生签到接口 */
  async onSignIn(ajaxData) {
    const url = `https://1069568596212347.cn-beijing.fc.aliyuncs.com/2016-08-15/proxy/${YsGlobal.serviceInfo.aliUrl}/addsignin/`;
    const JSON_HEADER_CONF = {
      'Content-Type': 'application/json',
    };
    return post(url, ajaxData, 'object', JSON_HEADER_CONF);
  }

  /* 获取在线签到人数 */
  getOnlineNum(ajaxData) {
    const url = `https://1069568596212347.cn-beijing.fc.aliyuncs.com/2016-08-15/proxy/${YsGlobal.serviceInfo.aliUrl}/getOnlineNum/`;
    const JSON_HEADER_CONF = {
      'Content-Type': 'application/json',
    };
    return post(url, ajaxData, 'object', JSON_HEADER_CONF);
  }

  /* 老师结束点名 */
  async rollcalladd(ajaxData) {
    const url = `https://1069568596212347.cn-beijing.fc.aliyuncs.com/2016-08-15/proxy/${YsGlobal.serviceInfo.aliUrl}/rollcalladd/`;
    const JSON_HEADER_CONF = {
      'Content-Type': 'application/json',
    };
    return post(url, ajaxData, 'object', JSON_HEADER_CONF);
  }

  /* 上传图片监听 */
  async upLoadPic(url, data) {
    return get(url, data, 'object');
  }

  /* 发送礼物 */
  sendGift(participantIdJson) {
    const ajaxData = {
      serial: YsGlobal.roomInfo.serial, // 教室id
      sendid: liveRoom.getMySelf().id, // 送礼物人id
      sendname: liveRoom.getMySelf().nickname, // 送礼物人名字'
    };
    for (const [key, value] of Object.entries(participantIdJson)) {
      // 收礼物人的id和名字
      ajaxData[`receivearr[${key}]`] = value;
    }
    const url = `${YsGlobal.serviceInfo.webRequest}/ClientAPI/sendgift?ts=${new Date().getTime()}`;
    return post(url, ajaxData);
  }

  /* 获取礼物 */
  getGiftInfo(participantId) {
    const ajaxData = {
      serial: YsGlobal.roomInfo.serial, // 教室id
      receiveid: participantId, // 收礼物人id
    };
    const url = `${YsGlobal.serviceInfo.webRequest}/ClientAPI/getgiftinfo?ts=${new Date().getTime()}`;
    return post(url, ajaxData);
  }

  // 获取服务器列表
  getServiceList(user, cb) {
    const { host, port } = YsGlobal.serviceInfo;
    const options = {
      selfip: user.ys_ip,
      companyid: YsGlobal.roomInfo.companyid,
    };
    liveRoom.requestServerList(host, port, list => cb(list), undefined, options);
  }

  /* 获取cnd列表 */
  getAllCndIp() {
    const url = `${YsGlobal.serviceInfo.webRequest}/ClientAPI/getcdnlist?ts=${new Date().getTime()}`;
    return get(url);
  }

  getAnswerDetail(data) {
    const url = `${YsGlobal.serviceInfo.webRequest}/ClientAPI/simplifyAnswer?ts=${new Date().getTime()}`;
    const { serial } = YsGlobal.roomInfo;
    return post(url, { serial, ...data, page: 0, pageNum: 200 });
  }

  getupdateinfo(version, type) {
    const { protocol, host } = getServiceInfo();
    const url = `${protocol}://${host}/ClientAPI/getupdateinfo`;
    const data = {
      version,
      type,
    };
    return post(url, data, false);
  }
}

export default FetchService.getInstance();
