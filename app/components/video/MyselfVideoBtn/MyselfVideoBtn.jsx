import React from 'react';
import { YsGlobal } from '@global/handleGlobal';
import { liveRoom } from '@global/roomConstants';
import UserService from '@global/services/UserService';
import './myselfVideoBtn.scss';
import store from '@app/store';
import Actions from '@global/actions';
const { video } = YsGlobal.languageInfo;

const MyselfVideoBtn = props => {
  const { audioFlag, videoFlag, onetoone } = props;
  const mySelf = liveRoom.getMySelf();
  const switchAudio = () => {
    UserService.changeUserAudio(mySelf);
  };

  const switchVideo = () => {
    UserService.changeUserVideo(mySelf);
  };

  const exchangechVideo = () => {
    Actions.exchangeOne2oneVideoLayout(!store.getState().classroom.isExchangeOne2oneLayout);
  };

  const onDoubleClickBtnMask = e => {
    if (e.target && e.target.nodeName === 'BUTTON') {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const studentStreamListLength = store.getState().video.studentStreamList.length;
  const { isVideoLayout } = store.getState().classroom;
  return (
    <div className="myself-video-btn-mask" onDoubleClick={onDoubleClickBtnMask}>
      <button onClick={switchAudio} className={`${audioFlag ? 'audio-mute' : 'audio'}`} title={`${audioFlag ? video.closeAudio : video.openAudio}`} />
      <button onClick={switchVideo} className={`${videoFlag ? 'camera' : 'camera-close'}`} title={`${videoFlag ? video.closeVideo : video.openVideo}`} />
      {YsGlobal.roomInfo.maxVideo === 2 && onetoone === 'nested' && studentStreamListLength === 1 && !isVideoLayout && (
        <button onClick={exchangechVideo} className="exchangevideoBtn" title={video.switchOne2oneVideoLayout} />
      )}
    </div>
  );
};

export default MyselfVideoBtn;
