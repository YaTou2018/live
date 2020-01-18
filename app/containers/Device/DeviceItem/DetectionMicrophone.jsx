// 麦克风检测
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SelectDumb from '@components/Select/Select';
import DeviceService from '@global/services/DeviceService';
import { YS } from '@global/roomConstants';
import Actions from '@global/actions';
import { YsGlobal } from '../../../global/handleGlobal';

const musicCh = require('../static/music/microphone_ch.mp3');
const musicEn = require('../static/music/microphone_en.mp3');
const music = YsGlobal.languageName === 'chinese' ? musicCh : musicEn;

const { deviceTest } = YsGlobal.languageInfo;
const { microphoneInner } = deviceTest;
const DetectionMicrophone = props => {
  const { isSetting, devices, useDevices, hasdevice, show, stepButtonFn, okButtonOnClick, changeSelectDevice, isInterior, isPlayMcro, changeplayMcro } = props;
  const [flag, setFlag] = useState(false);
  const audiooutputVolumeItemArray = [];
  for (let i = 0; i < 16; i += 1) {
    audiooutputVolumeItemArray.push(<li key={i} className="audiooutput-volume-item" />);
  }

  const audioinputArr = devices.audioinput;
  const audioinputSected = useDevices.audioinput;
  const audioinputIsUse = hasdevice.audioinput;

  const selectOnChange = (selectKey, value, even) => {
    changeSelectDevice(selectKey, value, even);
  };

  useEffect(() => {
    if (show) {
      if (!isInterior && !isPlayMcro) {
        YS.DeviceMgr.startSpeakerTest(useDevices.audiooutput, music, undefined, { loop: false });
        changeplayMcro(true);
      }
      DeviceService.audioSourceChangeHandlerFrom({
        deviceId: audioinputSected,
        audioinputAudioElementId: 'audioinput_audio_stream',
        audioinputVolumeContainerId: 'volume_audioinput_container',
      });
    }
  }, [audioinputSected, show]);
  return (
    <div style={{ display: show ? 'block' : 'none', marginTop: isInterior ? '130px' : '' }}>
      <div className="option-all">
        {isInterior ? (
          <span className="item_left" style={{ marginRight: '15px' }}>
            {microphoneInner.microphone}
          </span>
        ) : (
          <span className="item_left" style={{ display: isInterior ? 'none' : 'block' }}>
            {microphoneInner.microphoneset}
          </span>
        )}

        <SelectDumb selectOptions={audioinputArr} currentValue={audioinputSected} type="audioinput" onChange={selectOnChange} />
      </div>
      <p className="mcro_wrong" style={{ display: isInterior ? 'none' : 'block' }}>
        {microphoneInner.mcroWrong}
      </p>

      <div className="notice-gray notice_micro" style={{ display: isInterior ? 'none' : 'block' }}>
        {microphoneInner.microphon}
      </div>

      <div className="sound_box" style={{ marginTop: isInterior ? '34px' : '0.7rem' }}>
        <ul id="volume_audioinput_container">{audiooutputVolumeItemArray}</ul>
      </div>
      <div id="audioinput_audio_stream" style={{ display: 'none' }} />
      <div className="notice-carmera" style={{ display: flag ? 'block' : 'none' }}>
        <p>{microphoneInner.warm}</p>
        <p>{microphoneInner.warm1}</p>
        <p>{microphoneInner.warm2}</p>
        <p>{microphoneInner.warm3}</p>
        <p>{microphoneInner.warm4}</p>
        <p>{microphoneInner.warm5}</p>
        <p>{microphoneInner.warm6}</p>
        <div
          className="closeBtn"
          onClick={() => {
            setFlag(false);
          }}
        />
      </div>

      <div className="footer_btn footer-btn-micro" style={{ display: isInterior ? 'none' : 'block' }}>
        {!isSetting && (
          <button type="button" className="btn btn-cannot" onClick={() => stepButtonFn('testresult', 'audioinput', false)}>
            {microphoneInner.nochange}
          </button>
        )}
        {!isSetting && audioinputIsUse && (
          <button type="button" className="btn btn-can" onClick={() => stepButtonFn('testresult', 'audioinput', true)}>
            {microphoneInner.canchange}
          </button>
        )}
        {isSetting && (
          <button type="button" className="btn btn-can" onClick={() => okButtonOnClick(3)}>
            {microphoneInner.sure}
          </button>
        )}
      </div>
      <p
        className="notice-video"
        onClick={() => {
          setFlag(true);
        }}
        style={{ display: isInterior ? 'none' : 'block' }}
      >
        麦克风没有声音？点击这里
      </p>
      <div className="capaImg" style={{ display: isInterior ? 'none' : 'block' }}></div>
    </div>
  );
};

DetectionMicrophone.propTypes = {
  // 选项列表
  //   microphoneList: PropTypes.array,
  // 选中的设备
  //   selectMicrophone: PropTypes.string,
  // 确定按钮
  okButtonOnClick: PropTypes.func,
  // 设备可用/不可用 （按钮）
  stepButtonFn: PropTypes.func,
};
const mapStateToProps = state => ({
  isPlayMcro: state.Modules.isPlayMcro,
});

const mapDispatchToProps = () => ({
  changeplayMcro: data => {
    Actions.isplayMicro(data);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DetectionMicrophone);
