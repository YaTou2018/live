import { SET_DEVICELIST, SET_SYSTEMINFO, UPDATE_DEVICELIST, SET_CONFIRMBTNSTATE } from '../actionTypes/device';

const initialState = {
  /* 设备列表 */
  devices: {
    videoinput: [], // 视频
    audioinput: [], // 麦克风
    audiooutput: [], // 扬声器
  },
  /* 当前选中设备 */
  useDevices: {
    videoinput: undefined,
    audioinput: undefined,
    audiooutput: undefined,
  },
  /* 是否有设备 */
  hasdevice: {
    videoinput: false,
    audioinput: false,
    audiooutput: false,
  },
  /* 系统信息 */
  systemInfo: {
    currentUser: '', // 当前用户：
    operatingSystem: '', // 操作系统
    IPAddress: '----', // IP地址：
    LoginDevice: '----', // 登入设备
    networkDelay: '----', // 网络延时：
    packetLoss: '----', // 丢包率：
    browser: '----', // 浏览器：
    roomNumber: '----', // 房间号：
    versionNumber: '----', // 版本号
  },
  settingConfirmBtnState: 'waiting',
};

export default function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_DEVICELIST:
      return {
        ...state,
        ...payload.devicesInfo,
      };
    case SET_SYSTEMINFO:
      return {
        ...state,
        systemInfo: {
          ...payload.systemInfo,
        },
      };
    case UPDATE_DEVICELIST:
      return {
        ...state,
        ...payload,
      };
    case SET_CONFIRMBTNSTATE:
      return {
        ...state,
        settingConfirmBtnState: payload,
      };
    default: {
      return state;
    }
  }
}
