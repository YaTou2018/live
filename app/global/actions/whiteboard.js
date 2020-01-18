import store from '@app/store';
import { SET_IS_FULLSCREEN, SET_WHITE_BOARD_LAY, SET_WB_VIDEOSTATUS, SET_WB_MP3_STATUS } from '../actionTypes/whiteboard';

const setIsFullscreen = isFullscreen =>
  store.dispatch({
    type: SET_IS_FULLSCREEN,
    payload: isFullscreen,
  });

const setWhiteBoardLay = isShowWBLay =>
  store.dispatch({
    type: SET_WHITE_BOARD_LAY,
    payload: isShowWBLay,
  });

const setWBVideoStatus = videoStatus =>
  store.dispatch({
    type: SET_WB_VIDEOSTATUS,
    payload: videoStatus,
  });

const setWBMp3Status = mp3Status =>
  store.dispatch({
    type: SET_WB_MP3_STATUS,
    payload: mp3Status,
  });

export default {
  setIsFullscreen,
  setWhiteBoardLay,
  setWBVideoStatus,
  setWBMp3Status,
};
