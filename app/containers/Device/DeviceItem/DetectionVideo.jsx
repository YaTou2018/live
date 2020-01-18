// 视频检测
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SelectDumb from '@components/Select/Select';
import { YS } from '@global/roomConstants';
import { YsGlobal } from '../../../global/handleGlobal';
const musicCh = require('../static/music/camera_ch.mp3');
const musicEn = require('../static/music/camera_en.mp3');
const music = YsGlobal.languageName === 'chinese' ? musicCh : musicEn;
const { deviceTest } = YsGlobal.languageInfo;
const { videoInner } = deviceTest;
const DetectionVideo = props => {
  const {
    isSetting,
    isVideoMirror,
    devices,
    useDevices,
    hasdevice,
    show,
    changeSelectDevice,
    videoMirroringHandle,
    okButtonOnClick,
    stepButtonFn,
    isInterior,
  } = props;
  const videoinputArr = devices.videoinput;
  const videoinputSected = useDevices.videoinput;
  const videoinputIsUse = hasdevice.videoinput;
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    if (show) {
      if (!isInterior) {
        YS.DeviceMgr.startSpeakerTest(useDevices.audiooutput, music, undefined, { loop: false });
      }
      YS.DeviceMgr.startVideoTest(videoinputSected, 'videoinput_video_stream');
    }
  }, [videoinputSected, show]);

  const nextKey = 'audioinput';
  return (
    <div style={{ display: show ? 'block' : 'none' }}>
      <div className="option-all">
        {isInterior ? (
          <span className="item_left" style={{ marginRight: '15px' }}>
            {videoInner.cameraText}
          </span>
        ) : (
          <span className="item_left" style={{ display: isInterior ? 'none' : 'block' }}>
            {videoInner.camera}
          </span>
        )}

        <SelectDumb selectOptions={videoinputArr} currentValue={videoinputSected} type="videoinput" onChange={changeSelectDevice} />
      </div>

      <div className="notice-red" style={{ display: isInterior ? 'none' : 'block' }}>
        {videoInner.notice}
      </div>

      <div
        className={`videoinput_video_stream ${isVideoMirror ? 'video-mirror ' : ' '} ${isInterior ? 'isInterior_video' : ''}`}
        id="videoinput_video_stream"
      />

      <div className={`option-all option-all-jingxiang ${isInterior ? 'option-all-jingxiang-isInterior' : ''}`}>
        <span className="item_left">{videoInner.mirror}</span>
        <div className="item_right">
          <label className="radio_box">
            <div className={`icon ${isVideoMirror ? 'gouxuan' : 'weigouxuan'}`} />
            <input type="checkbox" name="mirroring" value="mirroring" id="srever_mirroring" defaultChecked={!!isVideoMirror} onClick={videoMirroringHandle} />
          </label>
        </div>
      </div>

      <div className="notice-carmera" style={{ display: flag ? 'block' : 'none' }}>
        <p>{videoInner.warm}</p>
        <p>{videoInner.warm1}</p>
        <p>{videoInner.warm2}</p>
        <p>{videoInner.warm3}</p>
        <p>{videoInner.warm4}</p>
        <p>{videoInner.warm5}</p>
        <p>{videoInner.warm6}</p>
        <div
          className="closeBtn"
          onClick={() => {
            setFlag(false);
          }}
        />
      </div>

      <div className="footer_btn footer_btn_video" style={{ display: isInterior ? 'none' : 'block' }}>
        {!isSetting && (
          <button type="button" className="btn btn-cannot" onClick={() => stepButtonFn(nextKey, 'videoinput', false)}>
            {videoInner.noVideo}
          </button>
        )}
        {!isSetting && videoinputIsUse && (
          <button type="button" className="btn btn-can" onClick={() => stepButtonFn(nextKey, 'videoinput', true)}>
            {videoInner.okVideo}
          </button>
        )}
        {isSetting && isInterior && (
          <button type="button" className="btn btn-can" onClick={() => okButtonOnClick(1)}>
            {videoInner.sure}
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
        {videoInner.noVideoBtn}
      </p>
      {!isInterior && <div className="capaImg"></div>}
    </div>
  );
};

DetectionVideo.propTypes = {
  // 确定按钮
  okButtonOnClick: PropTypes.func,
  // 设备可用/不可用 （按钮）
  stepButtonFn: PropTypes.func,
};

export default DetectionVideo;
