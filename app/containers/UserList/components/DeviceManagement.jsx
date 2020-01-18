/**
 * @description 设备管理
 */

import React, { useState } from 'react';
import { YsGlobal } from '@global/handleGlobal';
import SelectDumb from '@components/Select/Select';
import YsSliderDumb from '@components/slider/YsSlider';
const { userListInner, deviceTest } = YsGlobal.languageInfo;
const DeviceManagement = props => {
  const { devicesData, closeDevices, onOk } = props;
  const [audiooutputVolume, setAudiooutputVolume] = useState(100);
  const [audioinput, setAudioinput] = useState(devicesData.useDevices.audioinput);
  const [audiooutput, setAudiooutput] = useState(devicesData.useDevices.audiooutput);
  const [videoinput, setVideoinput] = useState(devicesData.useDevices.videoinput);
  const selectOnChange = (selectKey, value) => {
    switch (selectKey) {
      case 'audioinput':
        setAudioinput(value);
        break;
      case 'audiooutput':
        setAudiooutput(value);
        break;
      default:
        setVideoinput(value);
        break;
    }
  };
  /**
   * 处理音量改变事件
   * @param {Number} volume 要修改的音量
   */
  const handerVolumeOnAfterChange = volume => {
    setAudiooutputVolume(volume);
  };

  const handerVolumeOnBeforeChange = volume => {
    setAudiooutputVolume(volume);
  };
  return (
    <div className="device-control">
      <div className="control-header">
        <span className="text">{userListInner.remoteControl.deviceManagement}</span>
        <i className="icon icon-del" onClick={closeDevices} />
      </div>
      <div className="device-ops-wrapper">
        <div className="option-all">
          <span className="item_left">{deviceTest.microphoneInner.microphoneset}</span>
          <SelectDumb selectOptions={devicesData.devices.audioinput} currentValue={audioinput} type="audioinput" onChange={selectOnChange} />
        </div>
        <div className="option-all">
          <span className="item_left">{deviceTest.detectionAudioInner.headset}</span>
          <SelectDumb selectOptions={devicesData.devices.audiooutput} currentValue={audiooutput} type="audiooutput" onChange={selectOnChange} />
        </div>
        <div className="option-all">
          <span className="item_left">{deviceTest.videoInner.camera}</span>
          <SelectDumb selectOptions={devicesData.devices.videoinput} currentValue={videoinput} type="videoinput" onChange={selectOnChange} />
        </div>
        <div className="option-all" style={{ zIndex: 0 }}>
          <span className="item_left">{deviceTest.detectionAudioInner.earphoneVolume}</span>
          <div className="item_right ">
            <div className="sound-vol tool-slider">
              <div className="tool-slider_img"></div>
              {/* <i className="icon_volume icon-yinliang" /> */}
              <YsSliderDumb value={audiooutputVolume} onBeforeChange={handerVolumeOnBeforeChange} onAfterChange={handerVolumeOnAfterChange} />
              <div className="txt_volume">{audiooutputVolume}</div>
            </div>
          </div>
        </div>
        {/* 确认按钮 */}
        <button className="device-result-btn" onClick={() => onOk({ deviceIdMap: { audioinput, audiooutput, videoinput }, audiooutputVolume })}>
          {userListInner.networkExtend.title.sure}
        </button>
      </div>
    </div>
  );
};
export default DeviceManagement;
