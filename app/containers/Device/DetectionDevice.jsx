// 开始设备检测
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { YS, L } from '@global/roomConstants';
import DeviceService from '@global/services/DeviceService';
import { getStorage } from '@utils/ysUtils';
import Actions from '@global/actions';
import { YsGlobal } from '../../global/handleGlobal';
import DetectionTabs from './Tabs/DetectionTabs';
import DetectionVideo from './DeviceItem/DetectionVideo';
import DetectionAudio from './DeviceItem/DetectionAudio';
import DetectionMicrophone from './DeviceItem/DetectionMicrophone';
import DetectionResults from './DeviceItem/DetectionResults';

import './static/sass/index.scss';
import './static/sass/content.scss';
import './static/font/style.css';
class DetectionDevice extends Component {
  state = {
    selectKey: YsGlobal.isCheckAudioOutput ? 'audiooutput' : 'videoinput',
    deviceTestResult: {
      videoinput: true,
      audioinput: true,
      audiooutput: true,
      testresult: true,
    },
    isVideoMirror: JSON.parse(getStorage('isVideoMirror')),
  };

  componentDidMount() {
    Actions.toggleVideoMirror(this.state.isVideoMirror);
  }

  /* 改变设备 */
  changeSelectDevice(selectKey, value) {
    const { devices, hasdevice, useDevices } = this.props.device;
    useDevices[selectKey] = value;
    Actions.setDeviceList({
      devices,
      hasdevice,
      useDevices,
    });
  }

  /* 下一步按钮的点击事件 */
  stepButtonFn(nextKey, preKey, isSuccess) {
    this.stopDevice();
    const { deviceTestResult } = this.state;
    deviceTestResult[preKey] = isSuccess;
    this.setState({
      deviceTestResult,
    });
    /* 视频镜像 */
    DeviceService.changeVideoMirroringHandle(this.state.isVideoMirror);
    this.loadSelectShow(nextKey); // 加载下一页
  }

  stopDevice() {
    YS.DeviceMgr.stopVideoTest();
    YS.DeviceMgr.stopSpeakerTest();
    YS.DeviceMgr.stopMicrophoneTest();
  }

  /* 加载选中的检测界面显示 */
  loadSelectShow(selectKey) {
    this.setState({
      selectKey,
    });
  }

  /* 镜像 */
  videoMirroringHandle = () => {
    const { isVideoMirror } = this.state;
    this.setState({ isVideoMirror: !isVideoMirror });
  };

  afreshStart = () => {
    this.setState({
      deviceTestResult: {
        videoinput: true,
        audioinput: true,
        audiooutput: true,
        testresult: true,
      },
    });
    const selectPut = YsGlobal.isCheckAudioOutput ? 'audiooutput' : 'videoinput';
    this.loadSelectShow(selectPut);
  };

  onClickJoinRoom = () => {
    const { useDevices } = this.props.device;
    Object.entries(useDevices).forEach(([deviceKind, deviceId]) => {
      L.Utils.localStorage.setItem(L.Constant.deviceStorage[deviceKind], deviceId);
    });
    this.props.joinRoom();
  };

  render() {
    const { selectKey } = this.state;
    const detectionDeviceHandlers = () => ({
      stepButtonFn: this.stepButtonFn.bind(this),
      changeSelectDevice: this.changeSelectDevice.bind(this),
    });
    const { device } = this.props;
    return (
      <div className="main_device_testing" id="main_detection_device">
        <DetectionTabs selectKey={selectKey} resultsObj={this.state.deviceTestResult} />
        <div className="device_content">
          <DetectionAudio {...detectionDeviceHandlers()} show={selectKey === 'audiooutput'} {...device} />
          <DetectionVideo
            {...detectionDeviceHandlers()}
            show={selectKey === 'videoinput'}
            {...device}
            isVideoMirror={this.state.isVideoMirror}
            videoMirroringHandle={this.videoMirroringHandle}
          />
          <DetectionMicrophone {...detectionDeviceHandlers()} {...device} show={selectKey === 'audioinput'} />
          <DetectionResults
            resultsObj={this.state.deviceTestResult}
            show={selectKey === 'testresult'}
            reStart={this.afreshStart}
            {...device}
            joinRoom={this.onClickJoinRoom}
          />
          <div className="capacityImg"></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  device: {
    ...state.device,
  },
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DetectionDevice);
