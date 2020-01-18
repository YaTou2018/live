import { YS, liveRoom, L } from '@global/roomConstants';
import Actions from '@global/actions';
import store from '@app/store';
import { YsGlobal } from '@global/handleGlobal';
import { detectOS, getBrowserInfo, setStorage } from '@utils/ysUtils';
import { setUserProperty } from '../../utils/sign';

class DeviceService {
  constructor() {
    this.instance = null;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeviceService();
    }
    return this.instance;
  }

  checkNeedDetectionDevice(callback) {
    YS.DeviceMgr.getDevices(deviceInfo => {
      L.Logger.info('checkNeedDetectionDevice deviceInfo:', deviceInfo);
      try {
        let needDetection = true; // 默认需要检测
        const audioinputDeviceId = L.Utils.localStorage.getItem(L.Constant.deviceStorage.audioinput);
        const audiooutputDeviceId = L.Utils.localStorage.getItem(L.Constant.deviceStorage.audiooutput);
        const videoinputDeviceId = L.Utils.localStorage.getItem(L.Constant.deviceStorage.videoinput);

        if (YsGlobal.isCheckVideoDevice) {
          if (
            !(deviceInfo.hasdevice.audioinput && deviceInfo.hasdevice.videoinput) ||
            !(deviceInfo.useDevices.audioinput === audioinputDeviceId && deviceInfo.useDevices.videoinput === videoinputDeviceId)
          ) {
            // 三种设备有任何一个没有或者三种设备有任何一个设备id和缓存中的id不一样 ， 则需要检测界面
            needDetection = true;
          } else {
            needDetection = false;
          }
        }
        if (YsGlobal.isCheckAudioOutput) {
          if (!deviceInfo.hasdevice.audiooutput || !(deviceInfo.useDevices.audiooutput === audiooutputDeviceId)) {
            // 三种设备有任何一个没有或者三种设备有任何一个设备id和缓存中的id不一样 ， 则需要检测界面
            needDetection = true;
          } else {
            needDetection = false;
          }
        }

        if (callback && typeof callback === 'function') {
          callback(needDetection);
        }
        return needDetection;
      } catch (e) {
        L.Logger.error('YS enumerateDevices error:', e);
        return false;
      }
    });
  }

  getDevicesList(change, type) {
    if (YsGlobal.isMobile || (YsGlobal.isSafari && !YsGlobal.isCheckVideoDevice)) {
      return;
    }
    const { useDevices } = store.getState().device;
    const copyUseDevices = Object.assign({}, useDevices);
    YS.DeviceMgr.getDevices(deviceInfo => {
      L.Logger.info('getDevicesList deviceInfo:', deviceInfo);
      const { hasdevice, devices } = deviceInfo;
      for (const [key, value] of Object.entries(copyUseDevices)) {
        if (!value && devices[key] && devices[key].length) {
          copyUseDevices[key] = deviceInfo.useDevices[key] || devices[key][0].deviceId;
        }
      }
      if (change) {
        if (type === YS.DEVICE_STATE.DEVICE_REMOVE) {
          for (const [key, value] of Object.entries(change)) {
            if (useDevices[key] === value[0].deviceId) {
              copyUseDevices[key] = devices[key][0].deviceId;
            }
          }
        }
        this.setDevices({ selectDeviceInfo: copyUseDevices }); // 设置设备
        const { audioinput = [], videoinput = [] } = devices;
        const mySelf = liveRoom.getMySelf() || {};
        const hasVideo = !!videoinput.length;
        const hasAudio = !!audioinput.length;
        setUserProperty(mySelf.id, { hasvideo: hasVideo, hasaudio: hasAudio });
      }
      Actions.setDeviceList({
        devices,
        hasdevice,
        useDevices: copyUseDevices,
      });
    });
  }

  /* 获取用户系统信息，进入教室后的设置 */
  getSystemInfo() {
    const { serial } = YsGlobal.roomInfo;
    const mySelfInfo = liveRoom.getMySelf();
    const operatingSystem = detectOS();
    // this.state.testSystemInfo.mediaServer = this.useServerRealName;//媒体服务器
    // this.state.testSystemInfo.coursewareServer = window.WBGlobal.docAddressKey;//文件服务器
    Actions.setSystemInfo({
      currentUser: mySelfInfo.nickname, // 当前用户：
      operatingSystem, // 操作系统
      IPAddress: window.location.hostname, // IP地址：
      LoginDevice: mySelfInfo.devicetype, // 登入设备
      // networkDelay:"----",//网络延时：
      // packetLoss:"----",//丢包率：
      browser: `${getBrowserInfo().info.browserName}${getBrowserInfo().info.browserVersion}`, // 浏览器：
      roomNumber: serial, // 房间号：
      versionNumber: mySelfInfo.version, // 版本号
    });
  }

  deviceChangeListener() {
    if (YS.DeviceMgr.registerDeviceChangeListener) {
      YS.DeviceMgr.registerDeviceChangeListener((change, type) => {
        this.getDevicesList(change, type);
      });
    }
  }

  setDevices(json) {
    const { selectDeviceInfo } = json || {};
    YS.DeviceMgr.setDevices(selectDeviceInfo, () => L.Logger.error('set devices failed'));
  }

  audioSourceChangeHandlerFrom({ deviceId, audioinputAudioElementId, audioinputVolumeContainerId } = {}) {
    YS.DeviceMgr.startMicrophoneTest(deviceId, audioinputAudioElementId, instant => {
      const ins = (instant * (16 / 100)) / 16;
      const $audioVolumeElement = document.getElementById(audioinputVolumeContainerId);
      if ($audioVolumeElement) {
        const volumeIndex = Math.floor(ins * 16);
        $audioVolumeElement.childNodes.forEach((item, index) => {
          item.classList.remove('yes');
          if (index < volumeIndex) {
            item.classList.add('yes');
          }
        });
      }
    });
  }

  /* 视频镜像 */
  changeVideoMirroringHandle(data) {
    // const { isVideoMirror } = store.getState().common;
    Actions.toggleVideoMirror(data);
    setStorage('isVideoMirror', data);
  }
}

export default DeviceService.getInstance();
