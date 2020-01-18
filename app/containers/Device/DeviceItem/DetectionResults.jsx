// 检测结果
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { YS } from '@global/roomConstants';
import Actions from '@global/actions';
import { YsGlobal } from '../../../global/handleGlobal';

import musicNormalCh from '../static/music/report_normal_ch.mp3';
import musicNormalEn from '../static/music/report_normal_en.mp3';
import musicErrorCh from '../static/music/report_error_ch.mp3';
import musicErrorEn from '../static/music/report_error_en.mp3';
const { deviceTest } = YsGlobal.languageInfo;
const { resultsInner } = deviceTest;

const DetectionResults = props => {
  const { show, reStart, joinRoom, useDevices, changeplayMcro } = props;
  const { videoinput, audiooutput, audioinput } = props.resultsObj;
  const [music, setMusic] = useState(musicNormalCh);
  const changIsMcroPlay = () => {
    changeplayMcro(false);
    reStart();
  };
  useEffect(() => {
    if (videoinput && audiooutput && audioinput) {
      const musicNormal = YsGlobal.languageName === 'chinese' ? musicNormalCh : musicNormalEn;
      setMusic(musicNormal);
    } else {
      const musicError = YsGlobal.languageName === 'chinese' ? musicErrorCh : musicErrorEn;
      setMusic(musicError);
    }
    if (show) {
      YS.DeviceMgr.startSpeakerTest(useDevices.audiooutput, music, undefined, { loop: false });
    }
  });
  return (
    <div style={{ display: show ? 'block' : 'none' }}>
      <div className="result_capa_notice">
        <div className="result_notice">{videoinput && audiooutput && audioinput ? resultsInner.zc_result : resultsInner.yc_result}</div>
        <div className="capaImg_result"></div>
      </div>
      <dl className="result-box">
        <dt>
          <span>{resultsInner.detec}</span>
          <span>{resultsInner.result}</span>
          <span>{resultsInner.detail}</span>
        </dt>
        {YsGlobal.isCheckVideoDevice && (
          <dd className={videoinput ? 'colorNormal' : 'colorError'}>
            <span>{resultsInner.detecVideo}</span>
            <span>{videoinput ? resultsInner.normal : resultsInner.abnormal}</span>
            <span>{videoinput ? resultsInner.okVideo : resultsInner.noVideo}</span>
            {!videoinput && <div className="exclamation" />}
          </dd>
        )}
        {YsGlobal.isCheckAudioOutput && (
          <dd className={audiooutput ? 'colorNormal' : 'colorError'}>
            <span>{resultsInner.detecSpeacker}</span>
            <span>{audiooutput ? resultsInner.normal : resultsInner.abnormal}</span>
            <span>{audiooutput ? resultsInner.oklisten : resultsInner.nolisten}</span>
            {!audiooutput && <div className="exclamation" />}
          </dd>
        )}
        {YsGlobal.isCheckVideoDevice && (
          <dd className={audioinput ? 'colorNormal' : 'colorError'}>
            <span>{resultsInner.detecMicro}</span>
            <span>{audioinput ? resultsInner.normal : resultsInner.abnormal}</span>
            <span>{audioinput ? resultsInner.okMicro : resultsInner.noMicro}</span>
            {!audioinput && <div className="exclamation" />}
          </dd>
        )}
      </dl>

      <div className="footer_btn footer_btn_result">
        <button type="button" className="btn btn-cannot" onClick={changIsMcroPlay}>
          {resultsInner.anew}
        </button>
        <button type="button" className="btn btn-can" onClick={joinRoom}>
          {resultsInner.intoClass}
        </button>
      </div>
    </div>
  );
};

DetectionResults.propTypes = {
  // 检测结果对象
  resultsObj: PropTypes.object,
  // 进入教室方法
  joinRoom: PropTypes.func,
  // 重新检测方法
  reStart: PropTypes.func,

  show: PropTypes.bool,
};

const mapDispatchToProps = () => ({
  changeplayMcro: data => {
    Actions.isplayMicro(data);
  },
});

export default connect(mapDispatchToProps)(DetectionResults);
