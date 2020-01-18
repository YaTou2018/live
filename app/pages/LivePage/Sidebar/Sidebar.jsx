import React, { useState, useEffect, useRef } from 'react';
import './sidebar.scss';
import Signalling from '@global/services/SignallingService';
import ChatBox, { ChatRenderPosition } from '@containers/Chat';
import TeacherVideo from '@containers/TeacherVideo/TeacherVideo';
import GlobalControlBtn from '@containers/GlobalControlBtn/GlobalControlBtn';
import { liveRoom, ROOM_ROLE, EVENT_TYPE, BASE_WIDTH, BASE_NUMBER } from '@global/roomConstants';
import Actions from '@global/actions';
import { YsGlobal } from '@global/handleGlobal';
import { connect } from 'react-redux';
import StudentVideoList from '../../../containers/StudentVideoList/StudentVideoList';
const { isLiveRoom } = YsGlobal.roomInfo;
let one2oneLayout = '';
const isTeacher = () => {
  const user = liveRoom.getMySelf() || {};
  return user.role === ROOM_ROLE.TEACHER || user.role === ROOM_ROLE.ASSISTANT;
};
const Sidebar = props => {
  const { isVideoLayout, isClassBegin, isFoldedOne2oneLayout, doubleVideoId } = props;
  const { maxVideo } = YsGlobal.roomInfo;

  let isMousedown = false;
  let mouseStartX;
  let headerHeight;
  let setSideBarWBtnHeight;
  let maxTop;
  const [onetooneLayout, setOnetoOneLayout] = useState('');

  const sideWidth = useRef(null);
  const $sideBar = useRef(null);
  const $setSideBarW = useRef(null);
  const $setSideBarWBtn = useRef(null);
  useEffect(() => {
    if (isVideoLayout && document.querySelector('.video-Layout-box')) {
      document.querySelector('.video-Layout-box').style.top = 'auto';
    }
    handleResize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVideoLayout]);
  useEffect(() => {
    if (!$sideBar || !$sideBar.current || maxVideo > 2) return;
    // 拖拽初始化
    initSideWidthData();
    const roomLayoutInfo = YsGlobal.msgList.find(item => item.name === 'one2oneVideoSwitchLayout');
    if (!roomLayoutInfo) return;
    setOnetoOneLayout(roomLayoutInfo.data.one2one);
    setSideWidth(roomLayoutInfo.data.one2one);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleResize = () => {
    const widthDefault = Math.round(4.22 * (window.innerWidth / BASE_WIDTH) * BASE_NUMBER);
    const widthMiddle = Math.floor((document.documentElement.clientWidth / 10) * 3);
    const widthMax = Math.floor(document.documentElement.clientWidth / 2);
    sideWidth.current = Object.assign({}, sideWidth.current, { widthDefault, widthMiddle, widthMax });
    setSideWidth(onetooneLayout);
    if (one2oneLayout === 'nested') {
      const scale = Number(YsGlobal.roomInfo.videoheight) / Number(YsGlobal.roomInfo.videowidth);
      if (document.querySelector('.topright')) {
        const content = document.querySelector('.sidebar') || {};
        document.querySelector('.topright').style.top = `${(content.clientHeight - sideWidth.current.widthMax * scale) / 2}px`;
      }
    } else if (document.querySelector('.topright')) {
      const content = document.querySelector('.sidebar') || {};
      const contentTop = document.querySelector('.placeholder-bg') || {};
      document.querySelector('.topright').style.top = `${(content.clientHeight - contentTop.clientHeight) / 2}px`;
    }
  };
  useEffect(() => {
    const listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    liveRoom.addEventListener('window-resize', handleResize, listernerBackupid);
    return () => {
      liveRoom.removeBackupListerner(listernerBackupid);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onetooneLayout]);
  useEffect(() => {
    // 监听布局改变信令
    const listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    if (maxVideo === 2) {
      liveRoom.addEventListener(
        EVENT_TYPE.roomPubmsg,
        res => {
          const { name, data } = res.message;
          if (name === 'one2oneVideoSwitchLayout' && !isMousedown) {
            setSideWidth(data.one2one);
            setOnetoOneLayout(data.one2one);
            Actions.exchangeOne2oneVideoLayout(false);
          }
        },
        listernerBackupid,
      );
      liveRoom.addEventListener(
        EVENT_TYPE.roomDelmsg,
        res => {
          const { name } = res.message;
          if (name === 'one2oneVideoSwitchLayout') {
            setSideWidth('');
            setOnetoOneLayout('');
            Actions.exchangeOne2oneVideoLayout(false);
          }
        },
        listernerBackupid,
      );
    }
    return () => {
      liveRoom.removeBackupListerner(listernerBackupid);
    };
  }, [isMousedown, maxVideo]);

  // 拖拽初始化
  const initSideWidthData = () => {
    const widthDefault = Math.round(4.22 * (window.innerWidth / BASE_WIDTH) * BASE_NUMBER);
    const widthMiddle = Math.floor((document.documentElement.clientWidth / 10) * 3);
    const widthMax = Math.floor(document.documentElement.clientWidth / 2);
    sideWidth.current = Object.assign({}, sideWidth.current, { widthDefault, widthMiddle, widthMax });
    setSideWidth(one2oneLayout);
  };

  const setSideWidth = (one2one, isNeedTransition = true) => {
    if (isNeedTransition) {
      $sideBar.current.style.transition = 'width ease 0.3s';
    }
    switch (one2one) {
      case 'abreast':
        $sideBar.current.style.width = `${sideWidth.current.widthMiddle}px`;
        break;
      case 'nested':
        $sideBar.current.style.width = `${sideWidth.current.widthMax}px`;
        break;
      default:
        $sideBar.current.style.width = `${sideWidth.current.widthDefault}px`;
        break;
    }
  };

  const startDrag = ev => {
    if (doubleVideoId) return;
    const oEvent = ev || window.event;
    mouseStartX = oEvent.clientX;
    const widthStart = $sideBar.current.offsetWidth;
    sideWidth.current = Object.assign({}, sideWidth.current, { widthStart });
    $sideBar.current.style.transition = '';
    Actions.setWhiteBoardLay(true);
    document.addEventListener('mousemove', doDrag, false);
    document.addEventListener('mouseup', stopDrag, false);
    document.addEventListener('mouseleave', stopDrag, false);
    isMousedown = true;
  };

  const doDrag = ev => {
    if (!isMousedown) return;
    const { widthDefault, widthStart, widthMiddle, widthMax } = sideWidth.current;
    const oEvent = ev || window.event;
    let w = mouseStartX - oEvent.clientX + widthStart;
    if (w < widthDefault) {
      w = widthDefault;
    } else if (w > widthMax) {
      w = widthMax;
    }
    if (w > widthDefault && w > widthMiddle * 0.8) {
      setOnetoOneLayout('abreast');
      if (w > widthMiddle * 1.2) {
        setOnetoOneLayout('nested');
        Actions.exchangeOne2oneVideoLayout(false, isFoldedOne2oneLayout);
      } else {
        Actions.exchangeOne2oneVideoLayout(false);
      }
    } else {
      setOnetoOneLayout('');
      Actions.exchangeOne2oneVideoLayout(false);
    }
    $sideBar.current.style.width = `${w}px`;
    sideWidth.current = Object.assign({}, sideWidth.current, { widthCur: w });
  };

  const stopDrag = () => {
    isMousedown = false;
    document.removeEventListener('mousemove', doDrag, false);
    document.removeEventListener('mouseup', stopDrag, false);
    document.removeEventListener('mouseleave', stopDrag, false);
    Actions.setWhiteBoardLay(false);
    if (!$sideBar) return;
    const { widthDefault, widthMiddle, widthCur } = sideWidth.current;
    one2oneLayout = '';
    if (widthCur > widthDefault && widthCur > widthMiddle * 0.8 && widthCur < widthMiddle * 1.2) {
      one2oneLayout = 'abreast';
    } else if (widthCur >= widthMiddle * 1.2) {
      one2oneLayout = 'nested';
    } else {
      one2oneLayout = '';
    }
    setSideWidth(one2oneLayout);
    if (one2oneLayout === 'nested') {
      const scale = Number(YsGlobal.roomInfo.videoheight) / Number(YsGlobal.roomInfo.videowidth);
      if (document.querySelector('.topright')) {
        const content = document.querySelector('.sidebar') || {};
        document.querySelector('.topright').style.top = `${(content.clientHeight - sideWidth.current.widthMax * scale) / 2}px`;
      }
    }
    if (one2oneLayout === onetooneLayout) {
      return;
    }
    // 发送信令
    Signalling.sendSignallingSetone2oneVideoLayout(one2oneLayout, !one2oneLayout);
    setOnetoOneLayout(one2oneLayout);
  };

  const setMouseTop = clientY => {
    let top = clientY - headerHeight - setSideBarWBtnHeight / 2;
    top = top < 0 ? 0 : top;
    top = top >= maxTop ? maxTop : top;
    $setSideBarWBtn.current.style.top = `${top}px`;
  };

  const mouEnterSetSideBarW = ev => {
    const oEvent = ev || window.event;
    headerHeight = document.getElementById('header').offsetHeight;
    setSideBarWBtnHeight = $setSideBarWBtn.current.offsetHeight;
    maxTop = $setSideBarW.current.offsetHeight - setSideBarWBtnHeight;
    setMouseTop(oEvent.clientY);
    $setSideBarW.current.onmousemove = mouMoveSetSideBarW;
    $setSideBarW.current.onmouseleave = mouOutSetSideBarW;
  };
  const mouMoveSetSideBarW = ev => {
    const oEvent = ev || window.event;
    setMouseTop(oEvent.clientY);
  };
  const mouOutSetSideBarW = () => {
    $setSideBarW.current.onmousemove = null;
    $setSideBarW.current.onmouseleave = null;
  };

  return (
    <div className="sidebar" ref={$sideBar}>
      {!isVideoLayout && <TeacherVideo onetoone={onetooneLayout} isTeacher />}
      {maxVideo === 2 && <StudentVideoList onetoone={onetooneLayout} />}
      {!isLiveRoom && isTeacher() && maxVideo > 2 && !isVideoLayout && <GlobalControlBtn distinction="top" />}
      <ChatRenderPosition isVideoLayout={isVideoLayout} onetoone={onetooneLayout}>
        <ChatBox isVideoLayout={isVideoLayout} onetoone={onetooneLayout} />
      </ChatRenderPosition>
      {maxVideo === 2 && isTeacher() && !doubleVideoId && (
        <div
          ref={$setSideBarW}
          className="changeSidebarSizeBox"
          style={{ display: !isVideoLayout && isClassBegin ? 'block' : 'none' }}
          onMouseDown={startDrag.bind(this)}
          onMouseEnter={mouEnterSetSideBarW.bind(this)}
        >
          <span ref={$setSideBarWBtn} className="changeSidebarSizeBtn"></span>
        </div>
      )}
    </div>
  );
};
const mapStateToProps = ({ classroom, video }) => {
  return {
    isVideoLayout: classroom.isVideoLayout,
    isClassBegin: classroom.isClassBegin,
    isFoldedOne2oneLayout: classroom.isFoldedOne2oneLayout,
    doubleVideoId: video.doubleVideoId,
  };
};

export default connect(mapStateToProps)(Sidebar);
