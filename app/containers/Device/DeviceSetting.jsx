// 设置
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { YS, liveRoom } from '@global/roomConstants';
import Actions from '@global/actions';
import DeviceService from '@global/services/DeviceService';
import { getStorage } from '@utils/ysUtils';
import Signalling from '@global/services/SignallingService';
import DetectionVideo from './DeviceItem/DetectionVideo';
import DetectionAudio from './DeviceItem/DetectionAudio';
import DetectionMicrophone from './DeviceItem/DetectionMicrophone';
import { YsGlobal } from '../../global/handleGlobal';
import './static/sass/index';
import './static/sass/content';
import './static/font/style.css';

const { deviceTest } = YsGlobal.languageInfo;
const { resultsInner } = deviceTest;

class DeviceSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVideoMirror: JSON.parse(getStorage('isVideoMirror')),
      isFirst: false,
      temporaryUseDevices: {},
    };
    this.closeButtonOnClick = this.closeButtonOnClick.bind(this);
    this.okButtonOnClick = this.okButtonOnClick.bind(this);
    props.clickConfirmBtn('waiting');
    this.listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
  }

  componentDidMount() {
    const { isLiveRoom } = YsGlobal.roomInfo;
    if (!isLiveRoom || liveRoom.getMySelf().role !== 2 || JSON.parse(localStorage.getItem('firstTimeWheat')) || this.props.isCheckMore) {
      this.setState({
        isFirst: true,
      });
    }
    const { useDevices } = this.props.device;
    this.setState({
      temporaryUseDevices: useDevices,
    });
  }

  /**
   * 关闭重置数据
   */
  closeButtonOnClick() {
    this.stopDevice();
    this.resetDefaultStateAndData();
    this.props.chengeIsCheckMore(false);
    // 是否为检测后的上麦按钮
    if (JSON.parse(this.props.applyWheat).isWheatbtn) {
      localStorage.setItem('firstTimeWheat', 'false');
    }
  }

  /**
   * 确认修改数据
   */
  okButtonOnClick = () => {
    const { temporaryUseDevices } = this.state;
    this.stopDevice();
    this.props.updateDeviceList({ useDevices: temporaryUseDevices });
    DeviceService.setDevices({ selectDeviceInfo: temporaryUseDevices }); // 设置设备
    DeviceService.changeVideoMirroringHandle(this.state.isVideoMirror); // 视频镜像
    this.resetDefaultStateAndData();
    // 是否为检测后的上麦按钮
    if (JSON.parse(this.props.applyWheat).isWheatbtn) {
      this.props.clickConfirmBtn('clicked');
      // 申请上麦信令;
      const myselfInfo = liveRoom.getMySelf() || {};
      const actions = {
        [myselfInfo.id]: JSON.stringify({ id: myselfInfo.id, name: myselfInfo.nickname, time: new Date().getTime() }),
      };
      Signalling.sendSignallingApplyShowmine(this.listernerBackupid, 0, actions, myselfInfo.id);
      localStorage.setItem('firstTimeWheat', 'true');
    }
  };

  stopDevice() {
    YS.DeviceMgr.stopVideoTest();
    YS.DeviceMgr.stopSpeakerTest();
    YS.DeviceMgr.stopMicrophoneTest();
  }

  /**
   * 重置默认数据
   */
  resetDefaultStateAndData() {
    const { useDevices } = this.props.device;
    this.setState({
      temporaryUseDevices: useDevices,
    });
    this.props.activeToggle('deviceSetting');
  }

  /**
   * 列表选择框改变
   * @param {String} deviceType
   * @param {*} deviceId
   * @param {Document} event
   */
  changeSelectDevice = (deviceType, deviceId, event) => {
    this.changeStateSelectDevice(deviceType, deviceId);
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  /**
   * 更改选中的设备
   */
  changeStateSelectDevice(deviceKind, deviceId) {
    const newUseDevices = Object.assign({}, this.state.temporaryUseDevices);
    newUseDevices[deviceKind] = deviceId;
    this.setState({
      temporaryUseDevices: newUseDevices,
    });
  }

  /* 镜像 */
  videoMirroringHandle = () => {
    const { isVideoMirror } = this.state;
    return this.setState({ isVideoMirror: !isVideoMirror });
  };

  render() {
    const { isFirst, temporaryUseDevices } = this.state;
    const { devices, hasdevice } = this.props.device;
    const deviceMsg = { devices, useDevices: temporaryUseDevices, hasdevice };
    // isInterior 是否为内部检测
    return (
      <div
        className="main_device_setting"
        onClick={e => {
          e.stopPropagation();
        }}
        id="main_detection_device"
      >
        <div className="device_header">
          <span>{resultsInner.set}</span>
          <div className="icon icon-del" onClick={this.closeButtonOnClick} />
        </div>
        <div className="device_main">
          <div className="device_content">
            <DetectionVideo
              show={isFirst}
              isSetting={this.props.isSetting}
              {...deviceMsg}
              okButtonOnClick={this.okButtonOnClick}
              changeSelectDevice={this.changeSelectDevice}
              isVideoMirror={this.state.isVideoMirror}
              videoMirroringHandle={this.videoMirroringHandle}
              isInterior="true"
            />
            <DetectionMicrophone
              show={isFirst}
              isSetting={this.props.isSetting}
              {...deviceMsg}
              okButtonOnClick={this.okButtonOnClick}
              changeSelectDevice={this.changeSelectDevice}
              deviceMsg={deviceMsg}
              isInterior="true"
            />
            <DetectionAudio
              show="true"
              isSetting={this.props.isSetting}
              {...deviceMsg}
              okButtonOnClick={this.okButtonOnClick}
              changeSelectDevice={this.changeSelectDevice}
              isInterior="true"
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  device: state.device,
  isSetting: state.common.visible === 'deviceSetting',
  applyWheat: JSON.stringify(state.Modules.applyWheat),
  confirmState: state.device.settingConfirmBtnState,
  isCheckMore: state.common.isCheckMore,
});

const mapDispatchToProps = dispatch => ({
  activeToggle: type => {
    dispatch(Actions.toggleNavbar(type));
  },
  updateDeviceList: data => {
    dispatch(Actions.updateDeviceList(data));
  },
  clickConfirmBtn: state => {
    Actions.setConfirmBtnState(state);
  },
  chengeIsCheckMore: data => {
    Actions.toggleIscheckMore(data);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceSetting);
