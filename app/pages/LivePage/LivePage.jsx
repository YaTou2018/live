import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import RoomService from '@global/services/RoomService';
import { YsGlobal } from '@global/handleGlobal';
import { liveRoom, ROOM_STATE, ROOM_ROLE } from '@global/roomConstants';
import ShowAlert from '@containers/ShowAlert/ShowAlert'; // 弹框
import NetworkJitter from '@containers/NetworkJitter/NetworkJitter';
import { useDrop } from 'react-dnd';
import RoomInit from '../../global/services';
import './LivePage.scss';
import Header from './Header/Header';
import Section from './Section/Section';
import Sidebar from './Sidebar/Sidebar';
import NavBar from './NavBar/NavBar';

const { liveMobilePage, pagesText } = YsGlobal.languageInfo;

const LivePage = props => {
  const [, dropTarget] = useDrop({
    // accept 是一个标识，需要和对应的 drag 元素中 item 的 type 值一致，否则不能感应
    accept: 'videoDrag',
    drop(item, monitor) {
      return { eleOffset: monitor.getSourceClientOffset() };
    },
    // collect 函数，返回的对象会成为 useDrop 的第一个参数，可以在组件中直接进行使用
  });
  useEffect(() => {
    RoomInit();
    return () => {
      RoomService.uninit();
    };
  }, []);

  const mouseLeave = event => {
    const mySelf = liveRoom.getMySelf() || {};
    const canChangeResizeEle = mySelf.role !== ROOM_ROLE.STUDENT;
    if (canChangeResizeEle) {
      if (YsGlobal.videoSizeMouseUpEventName) {
        liveRoom.dispatchEvent({ type: YsGlobal.videoSizeMouseUpEventName, message: { event } });
      }
    }
  };

  const mouseMove = event => {
    const mySelf = liveRoom.getMySelf() || {};
    const canChangeResizeEle = mySelf.role !== ROOM_ROLE.STUDENT;
    if (canChangeResizeEle) {
      if (YsGlobal.videoSizeMouseMoveEventName) {
        liveRoom.dispatchEvent({ type: YsGlobal.videoSizeMouseMoveEventName, message: { event } });
      }
    }
  };

  const mouseUp = event => {
    const mySelf = liveRoom.getMySelf() || {};
    const canChangeResizeEle = mySelf.role !== ROOM_ROLE.STUDENT;
    if (canChangeResizeEle) {
      // 如果您想以一个异步的方式来访问事件属性，您应该对事件调用event.persist()。这将从事件池中取出合成的事件，并允许该事件的引用，使用户的代码被保留
      event.persist();
      if (YsGlobal.videoSizeMouseUpEventName) {
        liveRoom.dispatchEvent({ type: YsGlobal.videoSizeMouseUpEventName, message: { event } });
      }
    }
  };

  const renderLivePage = () => {
    const {
      livePageState: { roomStatus },
    } = props;
    const mySelf = liveRoom.getMySelf() || {};
    const addEventsNone = mySelf.role === 4 ? 'patrol-events-none' : '';
    return (
      <div ref={dropTarget} className={`livePage ${YsGlobal.playback ? 'playback' : ''} ${addEventsNone}`}>
        {' '}
        {<NetworkJitter show={roomStatus === ROOM_STATE.DISCONNECT} />}
        <Header />
        <div className="container" onMouseUp={mouseUp} onMouseMove={mouseMove} onMouseLeave={mouseLeave}>
          <NavBar />
          <Section />
          <Sidebar />
        </div>
      </div>
    );
  };

  const renderLoading = () => {
    return (
      <div className="connect-loading">
        <div className="loading_inner"> {YsGlobal.playback ? pagesText.livePageInner.intoBack : liveMobilePage.enterLanguage}</div>
        <ShowAlert />
      </div>
    );
  };

  const renderClassEnd = () => {
    return (
      <div className="connect-loading">
        <div className="loading_inner"> {pagesText.livePageInner.classOver}</div>
      </div>
    );
  };

  const {
    livePageState: { roomStatus, isClassBegin },
  } = props;
  if (roomStatus === ROOM_STATE.CONNECTED || roomStatus === ROOM_STATE.DISCONNECT) {
    return renderLivePage();
  }
  if (isClassBegin === false || roomStatus === ROOM_STATE.END) {
    return renderClassEnd();
  }
  if (roomStatus !== ROOM_STATE.DISCONNECT) {
    return renderLoading();
  }
  return '';
};

const mapStateToProps = state => ({
  livePageState: {
    roomStatus: state.classroom.roomStatus,
    isClassBegin: state.classroom.isClassBegin,
  },
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LivePage);
