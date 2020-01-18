import { SET_IS_FULLSCREEN, SET_WHITE_BOARD_LAY, SET_WB_VIDEOSTATUS, SET_WB_MP3_STATUS } from '../actionTypes/whiteboard';

const initialState = {
  isFullScreen: false,
  isShowWhiteBoardLay: false,
  mp4Status: 'end', // play~播放 | pause~暂停 | end~结束
  mp3Status: 'end', // play~播放 | pause~暂停 | end~结束
};

export default function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_IS_FULLSCREEN:
      return {
        ...state,
        isFullScreen: payload,
      };
    case SET_WHITE_BOARD_LAY:
      return {
        ...state,
        isShowWhiteBoardLay: payload,
      };
    case SET_WB_VIDEOSTATUS:
      return {
        ...state,
        mp4Status: payload,
      };
    case SET_WB_MP3_STATUS:
      return {
        ...state,
        mp3Status: payload,
      };
    default:
      return state;
  }
}
