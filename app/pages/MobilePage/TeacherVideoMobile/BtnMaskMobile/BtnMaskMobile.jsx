import React from 'react';
import PropTypes from 'prop-types';
import { YsGlobal } from '@global/handleGlobal';
import { connect } from 'react-redux';
import Actions from '@global/actions';

// let { } = YsGlobal.languageInfo;
import './btnMaskMobile.scss';
const { isLiveRoom } = YsGlobal.roomInfo;
const BtnMaskMobile = props => {
  const { isBarrage, switchBarrage, isFullScreen, switchFullScreen, mp4Status, rotate, hasBtnMaskMobile } = props;
  // const backpage = () => {
  //   props.setMaskIsShow(true);
  // };
  return (
    <div className={`btn-mask-mobile ${hasBtnMaskMobile ? '' : 'hide'}`}>
      {/* <button className="backPage" onClick={backpage} /> */}
      {/* <span className="room-num">房间号：{YsGlobal.roomInfo.serial}</span> */}
      {isFullScreen && <button className={`btn-barrage-switch ${isBarrage ? '' : 'off'}`} onClick={switchBarrage} />}
      {/* {mp4Status === 'end' && !rotate && isLiveRoom && <button className={`btn-full-screen ${isFullScreen ? '' : 'off'} `} onClick={switchFullScreen} />} */}
    </div>
  );
};
BtnMaskMobile.propTypes = {
  isBarrage: PropTypes.bool,
  isFullScreen: PropTypes.bool,
  switchBarrage: PropTypes.func,
  switchFullScreen: PropTypes.func,
};

const mapStateToProps = state => ({
  isShowOutLive: state.Modules.isShowOutLive,
  mp4Status: state.whiteboard.mp4Status,
});

const mapDispatchToProps = () => ({
  setMaskIsShow: data => {
    Actions.isShowMobilemask(data);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BtnMaskMobile);
