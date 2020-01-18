import React, { useState, useEffect } from 'react';
import WhiteboardService from '@global/services/WhiteboardService';
import { liveRoom, EVENT_TYPE } from '@global/roomConstants';
import { connect } from 'react-redux';
import VideoMark from '@containers/VideoMark/VideoMark';
import Signalling from '@global/services/SignallingService';
import store from '@app/store';
import PropTypes from 'prop-types';
import UserService from '@global/services/UserService';
import { fullScreen as ysfullScreen, exitFullscreen, getFullscreenElement } from '@utils/ysUtils';
import { YsGlobal } from '@global/handleGlobal';
import actions from '@global/actions';
import ToolBar from '../WhiteboardToolsBar/WhiteboardToolsBar';
import Actions from '../../global/actions/whiteboard';
import { setUserProperty } from '../../utils';

import './static/sass/mainWhiteboard.scss';
import './static/sass/documentToolbar.scss';

const colors = [
  '#9B9B9B',
  '#FF7EA1',
  '#FF3B58',
  '#F08218',
  '#B66700',
  '#8F4200',
  '#FF7500',
  '#FFD100',
  '#FFF600',
  '#ABD500',
  '#78BC24',
  '#2EA937',
  '#16B4A4',
  '#40C3FF',
  '#008DEB',
  '#0043FF',
  '#BFC7FF',
  '#E352FF',
  '#76288B',
  '#412088',
  '#0F2378',
];
let defaultRoadofcloudFullScreen;
let headerFullScreen;
const { whiteboard } = YsGlobal.languageInfo;
const WHITE_BOARD_CONTAINER_ID = 'big_literally_wrap'; // 白板容器的id
const BaseWhiteboard = props => {
  const [canDraw, setCandraw] = useState(false);
  const { mp4Status, isClassBegin } = props;
  const mySelf = liveRoom.getMySelf() || {};

  useEffect(() => {
    const handleResize = () => {
      if (!headerFullScreen) return;
      const classNames = defaultRoadofcloudFullScreen.className;
      const headerFullScreenClass = headerFullScreen.className;
      if (getFullscreenElement()) {
        defaultRoadofcloudFullScreen.className = `${classNames} yes`;
        defaultRoadofcloudFullScreen.title = whiteboard.exitFullScreen;

        headerFullScreen.className = headerFullScreenClass.replace('fullScreen', 'exitFullScreen');
      } else {
        defaultRoadofcloudFullScreen.className = classNames.replace('yes', '');
        defaultRoadofcloudFullScreen.title = whiteboard.fullScreen;

        headerFullScreen.className = headerFullScreenClass.replace('exitFullScreen', 'fullScreen');
      }
    };
    const listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    liveRoom.addEventListener('window-resize', handleResize, listernerBackupid);
    return () => {
      liveRoom.removeBackupListerner(listernerBackupid);
    };
  }, []);

  const whiteboardCallBack = (action, cmd) => {
    liveRoom.dispatchEvent({
      type: 'receiveWhiteboardSDKAction',
      message: { action, cmd, source: 'default' },
    });
    switch (action) {
      case 'viewStateUpdate': {
        const { fullScreen } = cmd.viewState;
        const { fileid, page = {} } = cmd.viewState;
        YsGlobal.currentFile = {
          fileId: fileid,
          currentPage: page.currentPage,
        };
        Actions.setIsFullscreen(fullScreen);
        break;
      }
      case 'mediaPlayerNotice': {
        const { playerType, type, attributes, userid } = cmd;
        if (playerType === 'videoPlayer') {
          if (type === 'play') {
            Actions.setWBVideoStatus('play');
          } else if (type === 'pause') {
            if (userid === liveRoom.getMySelf().id) {
              const data = { videoRatio: attributes.width / attributes.height };
              Signalling.sendVideoMark(data);
            }
            Actions.setWBVideoStatus('pause');
          } else if (type === 'end') {
            if (userid === liveRoom.getMySelf().id) {
              Signalling.sendVideoMark({}, true);
            }
            Actions.setWBVideoStatus('end');
          }
        } else if (playerType === 'audioPlayer') {
          if (type === 'play') {
            Actions.setWBMp3Status('play');
          } else if (type === 'pause') {
            Actions.setWBMp3Status('pause');
          } else if (type === 'end') {
            Actions.setWBMp3Status('end');
          }
        }

        break;
      }
      default:
        break;
    }
  };

  /* 初始化白板 */
  const initWhiteboardDefault = () => {
    const { isSupportPageTrun } = YsGlobal.roomConfigItem;
    const parentNode = document.getElementById(WHITE_BOARD_CONTAINER_ID); // 挂载白板的节点
    const whiteboardConfigration = {
      synchronization: false, // [0, 1].includes(mySelf.role), // 是否同步给其它用户,没上课不同步
      canDraw: false, // [0, 1].includes(mySelf.role), // 可画权限 , 授权可画
      canPage: [0, 1].includes(mySelf.role) || (mySelf.role === 2 && isSupportPageTrun),
      actionClick: [0, 1].includes(mySelf.role),
      addPage: false, // 加页权限(注：加页权限和翻页权限同时为true时才能加页)
      primaryColor: '#FF0000',
      pptVolumeSynchronization: [0, 1].includes(mySelf.role), // PPT音量是否同步
      isOnlyUndoRedoClearMyselfShape: mySelf.role === 2, // 是否只撤销、恢复、清除自己的画笔,默认false
      // isSyncMouseSwitch: [0, 1].includes(mySelf.role), // 是否同步鼠标/非鼠标的切换
      documentToolBarConfig: {
        isDrag: true,
        isLoadFullScreen: true, // 是否加载全屏，false
        isLoadRemark: true, // 是否加载文档备注，false
        isLoadVolume: true, // 是否加载动态ppt音量设置，false
        initDragPosition: {
          left: 50,
          top: 99,
        },
      },
      isLoadWhiteboardToolBar: false,
      fontSize: 48,
      canRemark: true,
      isLoadDocumentRemark: true,
      videoPlayerConfig: {
        controlPermissions: {
          hasPlayOrPause: [0, 1].includes(mySelf.role), // 播放暂停权限,默认true
          hasChangeProgress: [0, 1].includes(mySelf.role), // 改变进度权限，默认true
          hasClose: [0, 1].includes(mySelf.role), // 关闭权限，默认true
        },
      },
      audioPlayerConfig: {
        // 音频播放器配置
        isLoadControl: true, // 是否加载控制器,默认true(注：不提供给用户，自己内部使用)
        controlPermissions: {
          hasPlayOrPause: [0, 1].includes(mySelf.role), // 播放暂停权限,默认true
          hasChangeProgress: [0, 1].includes(mySelf.role), // 改变进度权限，默认true
          hasClose: [0, 1].includes(mySelf.role), // 关闭权限，默认true
        },
      },
      clickCapture: true, // 白板画笔是否穿透
      canWBPinch: mySelf.role === 2 && YsGlobal.isMobile, // 是否能双指缩放
    };
    WhiteboardService.getYsWhiteBoardManager().createMainWhiteboard(parentNode, whiteboardConfigration, whiteboardCallBack);

    headerFullScreen = document.querySelector('.allFull');
    defaultRoadofcloudFullScreen = document.querySelector('#defaultRoadofcloudFullScreen');
    const element = document.querySelector('#white_board_outer_layout');
    defaultRoadofcloudFullScreen.onclick = () => {
      if (getFullscreenElement()) {
        exitFullscreen();
      } else {
        ysfullScreen(element);
      }
    };
    const showPageMsg = YsGlobal.msgList.find(item => item.name === 'ShowPage');
    if (!showPageMsg) {
      const defaultFile = store.getState().file.fileList.find(file => parseInt(file.type, 10) === 1) || { fileid: 0, currpage: 1, pagenum: 1 };
      WhiteboardService.getYsWhiteBoardManager().changeDocument(defaultFile.fileid, defaultFile.currpage);
    }
  };
  useEffect(() => {
    initWhiteboardDefault();
    // 进入房间把老师和助教的画笔权限改为true
    if ([0, 1].includes(mySelf.role)) {
      setUserProperty(mySelf.id, { candraw: true });
    }
    return () => {
      WhiteboardService.getYsWhiteBoardManager().destroyMainWhiteboard(); // 销毁白板
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 处理用户属性改变 */
  useEffect(() => {
    const handleUserPropertyChanged = data => {
      const { user, message } = data;
      if (user.id === liveRoom.getMySelf().id) {
        Object.entries(message).forEach(([key, value]) => {
          if (key === 'candraw') {
            setCandraw(value);
            let color = '';
            if (value && user.role !== 0) {
              const users = liveRoom.getUsers();

              const colorArr = Object.values(users).map(it => it.primaryColor);
              const noIncludes = colors.filter(it => !colorArr.includes(it));
              if (noIncludes.length) {
                color = noIncludes[parseInt(Math.random() * noIncludes.length, 10)];
              } else {
                color = colors[parseInt(Math.random() * colors.length, 10)];
              }
              UserService.changeVideoUserPen(user.id, color);
            }
            WhiteboardService.getYsWhiteBoardManager().changeWhiteBoardConfigration(
              {
                // 改变主白板配置项（授权更新后）
                canDraw: isClassBegin && value, // 可画权限 , 授权可画
                canPage: value, // 翻页权限 , 如果有授权或者是学生且有支持翻页的配置项则能翻页
                actionClick: isClassBegin && value, // 动态PPT、H5文档等动作点击权限 , 授权可点
                synchronization: isClassBegin && value,
                primaryColor: [0, 1].includes(mySelf.role) ? mySelf.primaryColor : color,
              },
              'default',
            );
          }
        });
      }
    };
    const handleRoomPubmsg = res => {
      const { name, fromID } = res.message;
      if (name === 'ClassBegin') {
        const wbConfig = {
          synchronization: [0, 1].includes(mySelf.role) || mySelf.candraw,
          canPage: [0, 1].includes(mySelf.role) || mySelf.candraw,
          addPage: [0, 1].includes(mySelf.role) || mySelf.candraw,
          actionClick: [0, 1].includes(mySelf.role) || mySelf.candraw,
          canDraw: [0, 1].includes(mySelf.role) || mySelf.candraw,
        };
        WhiteboardService.getYsWhiteBoardManager().changeWhiteBoardConfigration(wbConfig);
        if (fromID === mySelf.id) {
          const { fileId, currentPage } = YsGlobal.currentFile;
          WhiteboardService.getYsWhiteBoardManager().changeDocument(fileId, currentPage);
        }
      }
    };
    const handleRoomMsglist = param => {
      const roomMsgList = param.data;
      roomMsgList.forEach(value => {
        switch (value.name) {
          case 'ClassBegin': {
            if ([0, 1].includes(mySelf.role)) {
              const wbConfig = {
                synchronization: true,
                canPage: true,
                addPage: true,
                actionClick: true,
                canDraw: true,
              };
              WhiteboardService.getYsWhiteBoardManager().changeWhiteBoardConfigration(wbConfig);
            }
            break;
          }
          default:
            break;
        }
      });
    };
    const listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    liveRoom.addEventListener(EVENT_TYPE.roomUserPropertyChanged, handleUserPropertyChanged, listernerBackupid);
    liveRoom.addEventListener(EVENT_TYPE.roomPubmsg, handleRoomPubmsg, listernerBackupid);
    liveRoom.addEventListener('room-msglist', handleRoomMsglist, listernerBackupid);
    return () => {
      liveRoom.removeBackupListerner(listernerBackupid);
    };
  }, [mySelf.primaryColor, isClassBegin]);

  useEffect(() => {
    if (mp4Status === 'end') {
      props.changAllFullFn(false);
    }
  }, [mp4Status]);

  const closeMp4 = () => {
    liveRoom.stopShareMedia();
  };

  return (
    <>
      {[0, 1].includes(mySelf.role) && mp4Status !== 'end' && <button className="close-mp4-btn" onClick={closeMp4} />}
      {/* 白板最外层包裹 */}
      <div id={WHITE_BOARD_CONTAINER_ID} className="big-literally-wrap" />
      {/* 白板画笔工具 */}
      {!YsGlobal.playback && <ToolBar instanceId="default" canDraw={canDraw} isClassBegin={isClassBegin} {...props} />}
      {mp4Status === 'pause' && <VideoMark />}
    </>
  );
};

BaseWhiteboard.propTypes = {
  isFullScreen: PropTypes.bool,
  switchBarrage: PropTypes.func,
  switchFullScreen: PropTypes.func,
};

const mapStateToProps = state => ({
  isClassBegin: state.classroom.isClassBegin,
  mp4Status: state.whiteboard.mp4Status,
});
const mapDispatchToProps = () => ({
  changAllFullFn: data => {
    actions.changeAllFull(data);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BaseWhiteboard);
