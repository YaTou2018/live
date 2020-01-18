import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { liveRoom, EVENT_TYPE, ROOM_ROLE, PUBLISH_STATE, NET_QUALITY } from '@global/roomConstants';
import Actions from '@global/actions';
import './static/sass/index.scss';
import './static/iconfont/style.scss';
import Timer from '@containers/timer';
import DeviceService from '@global/services/DeviceService';
import DeviceSetting from '@containers/Device/DeviceSetting';
import { fullScreen, exitFullscreen, getFullscreenElement } from '@utils/ysUtils';
import ClassButton from './ClassButton/ClassButton';
import SwitchLayout from './SwitchLayout/SwitchLayout';
import { YsGlobal } from '../../../global/handleGlobal';

const {
  header: headerLanguage,
  pagesText: { navBarInner },
} = YsGlobal.languageInfo;
const Header = props => {
  const { activeToggle, navBarState, mp4Status, changeApplyWheat, clickConfirmBtn, onlineStudentNum } = props;
  const { delay, isClassBegin, packetsLostRate, netquality } = props.headerState;
  const [isShowNetworkQuality, setIsShowNetworkQuality] = useState(false);
  const mySelf = liveRoom.getMySelf() || {};
  const [title, setTitle] = useState(navBarInner.fullScreen);
  const color = useRef(null);
  const text = useRef(headerLanguage.excellent);

  useEffect(() => {
    if (netquality === NET_QUALITY.YS_NET_QUALITY_EXCELLENT) {
      color.current = '#0cfe00';
      text.current = headerLanguage.excellent;
    } else if (netquality === NET_QUALITY.YS_NET_QUALITY_GOOD) {
      color.current = '#fbfe00';
      text.current = headerLanguage.good;
    } else if (netquality === NET_QUALITY.YS_NET_QUALITY_ACCEPTED) {
      color.current = '#ffcc01';
      text.current = headerLanguage.middle;
    } else {
      color.current = '#fe5656';
      text.current = headerLanguage.bad;
    }
  }, [netquality]);

  useEffect(() => {
    const handleResize = () => {
      if (getFullscreenElement()) {
        setTitle(navBarInner.exitFullScreen);
      } else {
        setTitle(navBarInner.fullScreen);
      }
    };
    const listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    liveRoom.addEventListener('window-resize', handleResize, listernerBackupid);
    return () => {
      liveRoom.removeBackupListerner(listernerBackupid);
    };
  }, []);

  useEffect(() => {
    /* 处理音视频状态改变 */
    const handleVideoStateChanged = streamPublishInfo => {
      const { message } = streamPublishInfo;
      if (message.userId === liveRoom.getMySelf().id) {
        if (message.publishstate === PUBLISH_STATE.NONE) {
          setIsShowNetworkQuality(false);
        } else {
          setIsShowNetworkQuality(true);
        }
      }
    };
    const listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    liveRoom.addEventListener(EVENT_TYPE.roomUserVideoStateChanged, handleVideoStateChanged, listernerBackupid);
    liveRoom.addEventListener(EVENT_TYPE.roomUserAudioStateChanged, handleVideoStateChanged, listernerBackupid);
    return () => {
      liveRoom.removeBackupListerner(listernerBackupid);
    };
  }, []);

  const changeFullscreen = () => {
    if (getFullscreenElement()) {
      exitFullscreen();
    } else {
      fullScreen();
    }
  };
  const {
    roomInfo: { isClassRoom, isMettingRoom, serial },
    isCheckAudioOutput,
    isCheckVideoDevice,
  } = YsGlobal;
  const { isShowStudentNum } = YsGlobal.roomConfigItem;
  const hasSwitchLayout = isClassBegin && (isClassRoom || isMettingRoom) && mp4Status === 'end';
  return (
    <div className="header" id="header">
      <div className="nav-bar">
        {isClassBegin && (
          <div className="clockIcon">
            {navBarInner.inClass} :&nbsp;
            <Timer />
          </div>
        )}
        <div className="roomserial">
          {headerLanguage.roomNoLanguage} :&nbsp;{serial}
        </div>
        {isShowNetworkQuality && (
          <>
            <div>
              {headerLanguage.packetlossLanguage} :&nbsp;{`${packetsLostRate}%`}
            </div>
            <div className="interdelay">
              {headerLanguage.delayLanguage} :&nbsp;<i>{delay}</i>ms
            </div>
            <div className="statusBox">
              {navBarInner.netWorkState} :&nbsp;<span>{text.current}</span>
            </div>
          </>
        )}
        {isShowStudentNum && <div className="student-num">{`${headerLanguage.onlineNumber}${onlineStudentNum}`}</div>}
      </div>
      <div className="header_right">
        {hasSwitchLayout && <SwitchLayout />}
        <div className="allFull fullScreen" title={title} onClick={changeFullscreen} />
        {mySelf.role !== ROOM_ROLE.PATROL && (isCheckAudioOutput || isCheckVideoDevice) && (
          <div
            className="deviceSetting"
            title={navBarInner.set}
            onClick={() => {
              activeToggle('deviceSetting');
              DeviceService.getDevicesList();
              changeApplyWheat(false);
              clickConfirmBtn('waiting');
            }}
          >
            {navBarState.visible === 'deviceSetting' && <DeviceSetting />}
          </div>
        )}
        {mySelf.role === ROOM_ROLE.TEACHER && <ClassButton isClassBegin={isClassBegin} />}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  headerState: {
    ...state.ys.networkState,
    ...{
      isClassBegin: state.classroom.isClassBegin,
    },
  },
  navBarState: {
    ...state.common,
  },
  onlineStudentNum: state.user.onlineStudentNum,
  mp4Status: state.whiteboard.mp4Status,
  confirmState: state.device.settingConfirmBtnState,
});

const mapDispatchToProps = dispatch => ({
  activeToggle: type => {
    dispatch(Actions.toggleNavbar(type));
  },
  changeApplyWheat: data => {
    Actions.applyWheatState(data);
  },
  clickConfirmBtn: state => {
    Actions.setConfirmBtnState(state);
  },
  chengeIsCheckMore: data => {
    Actions.toggleIscheckMore(data);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
