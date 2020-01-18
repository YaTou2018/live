import React, { useState, useEffect } from 'react';
import { liveRoom, EVENT_TYPE } from '@global/roomConstants';
import { connect } from 'react-redux';
import { YsGlobal } from '@global/handleGlobal';
import Signalling from '@global/services/SignallingService';
import UserService from '@global/services/UserService';
import Actions from '@global/actions';
import store from '@app/store';
import { getSendTime } from '@containers/Chat/utils';

const GlobalControlBtn = props => {
  const {
    liveAllNoChatSpeaking,
    userListData,
    videoDragInfo,
    distinction,
    isClassBegin,
    isVideoLayout,
    addChatList,
    liveAllNoAudio,
    setLiveAllNoAudio,
  } = props;

  const { userListInner } = YsGlobal.languageInfo;
  const [showBans, setShowBans] = useState(true);
  const [banAllAudio, setBanAllAudio] = useState(liveAllNoAudio);
  // const noPerson = !!userListData.filter(it => it.role !== 0 && it.role !== 1 && it.publishstate !== 0).length;
  useEffect(() => {
    setShowBans(!isVideoLayout);
  }, [isVideoLayout]);

  useEffect(() => {
    const handleRoomPubmsg = params => {
      const { name, data } = params.message;
      if (name === 'LiveAllNoAudio') {
        const test = !data.liveAllNoAudio ? userListInner.button.audio.on.title : userListInner.button.audio.off.title;
        const chatObj = {
          time: getSendTime(),
          msgtype: 'notice',
          data: {
            test,
          },
          id: new Date().getTime(),
        };
        addChatList(chatObj);
        setBanAllAudio(!data.liveAllNoAudio);
        setLiveAllNoAudio(!data.liveAllNoAudio);
      }
    };
    const listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    liveRoom.addEventListener(EVENT_TYPE.roomPubmsg, handleRoomPubmsg, listernerBackupid);
    return () => {
      liveRoom.removeBackupListerner(listernerBackupid);
    };
  }, []);

  // 全体禁音
  const banAudio = () => {
    // if (!banAllAudio) {
    //   userListData
    //     .filter(it => it.role !== 0 && it.role !== 1 && it.publishstate !== 0 && it.hasaudio && (it.publishstate === 1 || it.publishstate === 3))
    //     .forEach(user => UserService.changeUserAudio(user));
    // } else {
    //   userListData
    //     .filter(it => it.role !== 0 && it.role !== 1 && it.publishstate !== 0 && it.hasaudio && !(it.publishstate === 1 || it.publishstate === 3))
    //     .forEach(user => UserService.changeUserAudio(user));
    // }
    Signalling.sendSignallingToAllNoAudio({ liveAllNoAudio: banAllAudio });
  };

  // 全体禁言
  const banWord = () => {
    let isDelMsg = false;
    // const { userList } = store.getState().user;
    // if (!liveAllNoChatSpeaking) {
    //   userList.filter(it => it.role !== 0 && it.role !== 1 && !it.disablechat).forEach(user => UserService.userBanSpeak(user));
    // } else {
    //   userList.filter(it => it.role !== 0 && it.role !== 1 && it.disablechat).forEach(user => UserService.userBanSpeak(user));
    // }
    if (!liveAllNoChatSpeaking) {
      Signalling.sendSignallingToAllNoChatSpeaking(isDelMsg, { isAllBanSpeak: true });
    } else {
      isDelMsg = true;
      Signalling.sendSignallingToAllNoChatSpeaking(isDelMsg, { isAllBanSpeak: false });
    }
  };

  // 给所有人奖杯
  const giveAllCup = () => {
    if (isClassBegin) {
      userListData.forEach(user => {
        if (user.role !== 0 && user.role !== 1) {
          UserService.sendUserGift(user);
        }
      });
    }
  };

  // 全部恢复
  const recovery = () => {
    if (isClassBegin) {
      for (const value of Object.values(videoDragInfo)) {
        Actions.deleteVideoDragInfo(value.userId);
        Signalling.sendSignallingVideoDrag({}, value.userId, true);
      }
    }
  };

  return (
    <div className={`BanChat ${distinction === 'bottom' && showBans ? '' : 'short'}`}>
      <ul className="bans" style={{ display: showBans ? 'flex' : 'none' }}>
        <li
          onClick={banAudio}
          className={`${!banAllAudio ? 'none' : ''} ${isClassBegin === '' ? 'disabled' : ''}`}
          title={!banAllAudio ? userListInner.button.audio.on.title : userListInner.button.audio.off.title}
        ></li>
        <li
          onClick={banAudio}
          className={`${banAllAudio ? 'none' : ''} ${isClassBegin === '' ? 'disabled' : ''}`}
          title={!banAllAudio ? userListInner.button.audio.on.title : userListInner.button.audio.off.title}
        ></li>
        <li
          onClick={banWord}
          className={`${liveAllNoChatSpeaking ? 'none' : ''}`}
          title={!liveAllNoChatSpeaking ? userListInner.button.allmute.on.title : userListInner.button.allmute.off.title}
        ></li>
        <li
          onClick={banWord}
          className={`${!liveAllNoChatSpeaking ? 'none' : ''}`}
          title={!liveAllNoChatSpeaking ? userListInner.button.allmute.on.title : userListInner.button.allmute.off.title}
        ></li>
        <li
          onClick={giveAllCup}
          className={`${YsGlobal.roomInfo.isMettingRoom ? 'hide' : !isClassBegin ? 'disabledjb' : ''}`}
          title={userListInner.button.trophy.title}
        ></li>
        <li onClick={recovery} className={`${!isClassBegin ? 'disabledfh' : ''}`} title={userListInner.button.restoreDrag.title}></li>
      </ul>
      <div className={`triangle ${showBans ? '' : 'close'}`}></div>
      <div
        className="mixture"
        onClick={() => {
          setShowBans(!showBans);
        }}
        style={{ display: distinction === 'top' ? 'none' : '' }}
      ></div>
    </div>
  );
};
const mapStateToProps = state => {
  return {
    ...state.chat.privateData,
    liveAllNoChatSpeaking: state.chat.liveAllNoChatSpeaking,
    liveAllNoAudio: state.chat.liveAllNoAudio,
    userListData: state.user.userList,
    videoDragInfo: state.video.videoDragInfo,
    isClassBegin: state.classroom.isClassBegin,
    isVideoLayout: state.classroom.isVideoLayout,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addChatList: data => {
      dispatch(Actions.addChatList(data));
    },
    setLiveAllNoAudio: data => {
      dispatch(Actions.setLiveAllNoAudio(data));
    },
  };
};

// 连接组件
export default connect(mapStateToProps, mapDispatchToProps)(GlobalControlBtn);
