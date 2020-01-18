// 扬声器检测
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectDumb from '@components/Select/Select';
import YsSliderDumb from '@components/slider/YsSlider';
import { YS } from '@global/roomConstants';
import { YsGlobal } from '../../../global/handleGlobal';
import musicCh from '../static/music/loudspeaker_ch.mp3';
import musicEn from '../static/music/loudspeaker_en.mp3';
const music = YsGlobal.languageName === 'chinese' ? musicCh : musicEn;

const { deviceTest } = YsGlobal.languageInfo;
const { detectionAudioInner } = deviceTest;

class DetectionAudio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audiooutputVolume: 100,
      isFlag: false,
    };
  }

  componentDidMount() {
    if (!this.props.isInterior && this.props.show) {
      this.startSpeakerTest();
    }
  }

  /**
   * 处理音量改变事件
   * @param {Number} volume 要修改的音量
   */
  handerVolumeOnAfterChange = volume => {
    this.audiooutputVolume = undefined;
    YS.DeviceMgr.setSpeakerTestVolume(volume);
    this.setState({ audiooutputVolume: volume });
  };

  handerVolumeOnBeforeChange = volume => {
    this.audiooutputVolume = volume;
  };

  selectOnChange = (selectKey, value, even) => {
    const { useDevices } = this.props;
    this.props.changeSelectDevice(selectKey, value, even);
    YS.DeviceMgr.startSpeakerTest(useDevices.audiooutput, music, undefined, { loop: false });
  };

  startSpeakerTest() {
    const { useDevices } = this.props;
    YS.DeviceMgr.startSpeakerTest(useDevices.audiooutput, music, undefined, { loop: false });
  }

  render() {
    const { isSetting, devices, useDevices, hasdevice, isInterior } = this.props;
    const { isFlag } = this.state;
    const audiooutputArr = devices.audiooutput;
    const audiooutputSected = useDevices.audiooutput;
    const audiooutputIsUse = hasdevice.audiooutput;
    const nextKey = YsGlobal.isCheckVideoDevice ? 'videoinput' : 'testresult';
    return (
      <div style={{ display: this.props.show ? 'block' : 'none' }}>
        <div className="option-all">
          {isInterior ? (
            <span className="item_left" style={{ marginRight: '15px' }}>
              {detectionAudioInner.loudspeaker}
            </span>
          ) : (
            <span className="item_left textErJi" style={{ display: isInterior ? 'none' : 'block' }}>
              {detectionAudioInner.headset}
            </span>
          )}
          <SelectDumb selectOptions={audiooutputArr} currentValue={audiooutputSected} type="audiooutput" onChange={this.selectOnChange} />
        </div>

        <div className="notice-gray notice-gray-audio" style={{ display: isInterior ? 'none' : 'block' }}>
          {detectionAudioInner.hear}
        </div>

        <div className={`option-all option-all-audio ${isInterior ? 'option_all_audio_isInterior' : ''}`}>
          <div className="item_right">
            <div className="sound-vol tool-slider" style={{ marginTop: isInterior ? '27px' : '0', marginLeft: '30px' }}>
              <div className="tool-slider_img"></div>
              <YsSliderDumb
                value={this.audiooutputVolume !== undefined ? this.audiooutputVolume : this.state.audiooutputVolume}
                onBeforeChange={this.handerVolumeOnBeforeChange}
                onAfterChange={this.handerVolumeOnAfterChange}
              />
              <div className="txt_volume">{this.state.audiooutputVolume}</div>
            </div>
          </div>
          <span className="item_left">
            <button type="button" className="playImg" onClick={this.startSpeakerTest.bind(this)}></button>
            <p className="playImgAgin" onClick={this.startSpeakerTest.bind(this)}>
              {detectionAudioInner.agin}
            </p>
          </span>
        </div>

        <div className="notice-carmera" style={{ display: isFlag ? 'block' : 'none' }}>
          <p>{detectionAudioInner.warm}</p>
          <p>{detectionAudioInner.warm1}</p>
          <p>{detectionAudioInner.warm2}</p>
          <p>{detectionAudioInner.warm3}</p>
          <p>{detectionAudioInner.warm4}</p>
          <p>{detectionAudioInner.warm5}</p>
          <p>{detectionAudioInner.warm6}</p>
          <div
            className="closeBtn"
            onClick={() => {
              this.setState({ isFlag: false });
            }}
          />
        </div>

        <div className={`footer_btn ${isInterior ? 'footer_btn_isInterior' : ''}`} style={{ marginTop: isInterior ? '0' : '0.7rem' }}>
          {!isSetting && (
            <button type="button" className="btn btn-cannot" onClick={() => this.props.stepButtonFn(nextKey, 'audiooutput', false)}>
              {detectionAudioInner.noHear}
            </button>
          )}
          {!isSetting && audiooutputIsUse && (
            <button type="button" className="btn btn-can" onClick={() => this.props.stepButtonFn(nextKey, 'audiooutput', true)}>
              {detectionAudioInner.canHear}
            </button>
          )}
          {isSetting && (
            <button type="button" className="btn btn-can" onClick={() => this.props.okButtonOnClick(2)}>
              {detectionAudioInner.sure}
            </button>
          )}
        </div>
        <p
          className="helpBtn"
          onClick={() => {
            this.setState({ isFlag: true });
          }}
          style={{ display: isInterior ? 'none' : 'block' }}
        >
          {detectionAudioInner.nosound}
        </p>
        <div className="capaImg" style={{ display: isInterior ? 'none' : 'block' }}></div>
      </div>
    );
  }
}

DetectionAudio.propTypes = {
  // 选项列表
  //   AudioList: PropTypes.array,
  // 选中的设备
  //   selectAudio: PropTypes.string,

  // 确定按钮
  okButtonOnClick: PropTypes.func,
  // 设备可用/不可用 （按钮）
  stepButtonFn: PropTypes.func,
};

export default DetectionAudio;
