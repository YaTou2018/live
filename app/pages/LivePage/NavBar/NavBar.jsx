import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Actions from '@global/actions';
import { liveRoom, ROOM_ROLE, EVENT_TYPE } from '@global/roomConstants';
import './navBar.scss';
import './fonts/iconfont.css';
import { YsGlobal } from '@global/handleGlobal';
import CourseList from '@containers/CourseList';
import ToolsBox from '@containers/ToolsBox/ToolsBox';
import UserList from '@containers/UserList/UserList';

const { navBarInner } = YsGlobal.languageInfo.pagesText;

const NavBar = props => {
  const { isLiveRoom, isClassRoom } = YsGlobal.roomInfo;
  const [canDraw, setCandraw] = useState(false);
  const [isShowToolsBox, setIsShowToolsBox] = useState(false);
  const mySelf = liveRoom.getMySelf() || {};
  const { navBarState: navState, activeToggle, isClassBegin, isVideoLayout, mp4Status } = props;
  const { hasScreenShare, isSupportPageTrun } = YsGlobal.roomConfigItem;
  const navBarState = JSON.parse(navState);
  const toolsBoxInfo = {
    hasShareBtn: isClassBegin && hasScreenShare && ([0, 1].includes(mySelf.role) || (mySelf.role === 2 && !isLiveRoom)),
    hasCallRollBtn: isLiveRoom,
    hasLuckDrawBtn: isLiveRoom && isClassBegin,
    hasVoteBtn: isLiveRoom && isClassBegin,
    hasNoticeBoardBtn: isLiveRoom,
    hasNoticeInformBtn: isLiveRoom,
    hasUpDataPicture: isClassBegin && !isLiveRoom && mySelf.role !== ROOM_ROLE.PATROL,
    hasAnswerBtn: isClassBegin && isClassRoom && [0, 1].includes(mySelf.role),
  };

  useEffect(() => {
    let boole = false;
    for (const value of Object.values(toolsBoxInfo)) {
      if (value) {
        boole = true;
        break;
      }
    }
    setIsShowToolsBox(boole);
  }, [toolsBoxInfo]);

  /* 处理用户属性改变 */
  useEffect(() => {
    const handleUserPropertyChanged = data => {
      const { user } = data;
      Object.entries(user).forEach(([key, value]) => {
        if (user.id === liveRoom.getMySelf().id) {
          if (key === 'candraw') {
            setCandraw(value);
            setIsShowToolsBox(value);
            toolsBoxInfo.hasUpDataPicture = value;
          }
        }
      });
    };
    const listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    liveRoom.addEventListener(EVENT_TYPE.roomUserPropertyChanged, handleUserPropertyChanged, listernerBackupid);
    return () => {
      liveRoom.removeBackupListerner(listernerBackupid);
    };
  }, [toolsBoxInfo.hasUpDataPicture]);
  return (
    <ul className="navbar-container">
      <li
        style={{ display: mySelf.role !== ROOM_ROLE.STUDENT ? 'block' : 'none' }}
        className={`${navBarState.visible === 'userList' ? 'show' : ''} user-list-btn`}
        onClick={() => {
          activeToggle('userList');
        }}
        title={isLiveRoom ? navBarInner.userList : navBarInner.roster}
      >
        <UserList show={navBarState.visible === 'userList'} />
      </li>
      <li
        style={{ display: (mySelf.role !== ROOM_ROLE.STUDENT && !isVideoLayout) || (!isClassBegin && !isLiveRoom && isSupportPageTrun) ? 'block' : 'none' }}
        className={`${navBarState.visible === 'courseList' ? 'show' : ''} course-list-btn`}
        onClick={() => {
          activeToggle('courseList');
        }}
        title={isLiveRoom ? navBarInner.fileList : navBarInner.courseLib}
      >
        <CourseList isSupportPageTrun={mySelf.role === ROOM_ROLE.STUDENT} />
      </li>
      {!isVideoLayout && mp4Status === 'end' && (
        <li
          style={{ display: (mySelf.role !== ROOM_ROLE.STUDENT || canDraw) && isShowToolsBox ? 'block' : 'none' }}
          className={`${navBarState.visible === 'toolBar' ? 'show' : ''} tool-box-btn`}
          onClick={() => {
            activeToggle('toolBar');
          }}
          title={navBarInner.tools}
        >
          <ToolsBox toolsBoxInfo={JSON.stringify(toolsBoxInfo)} isSupportPageTrun={mySelf.role === ROOM_ROLE.STUDENT && canDraw} />
        </li>
      )}
    </ul>
  );
};

const mapStateToProps = state => ({
  navBarState: JSON.stringify({
    ...state.common,
  }),
  mp4Status: state.whiteboard.mp4Status,
  isVideoLayout: state.classroom.isVideoLayout,
  isClassBegin: state.classroom.isClassBegin,
});

const mapDispatchToProps = dispatch => ({
  activeToggle: type => {
    dispatch(Actions.toggleNavbar(type));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
