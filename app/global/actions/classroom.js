import store from '@app/store';
import {
  SET_ROOM_STATUS,
  BEGIN_CLASS,
  SET_IS_CLASS_BEGIN,
  SET_STUDENT_COUNT,
  SWITCH_LAYOUT,
  EXCHANGE_ONE2ONELAYOUT,
  INIT_CLASSROOM_STATE,
  SET_PAGE_ORIENTATION,
} from '../actionTypes/classroom';

/**
 * 房间状态
 * @param {String} status 房间状态
 */
const setRoomStatus = status =>
  store.dispatch({
    type: SET_ROOM_STATUS,
    payload: status,
  });

/**
 * 开始上课
 * @param {*} payload
 */
const beginClass = time =>
  store.dispatch({
    type: BEGIN_CLASS,
    payload: {
      time,
    },
  });

/**
 * 是否已上课
 * @param {*} payload
 */
const setIsClassBegin = isClassBegin =>
  store.dispatch({
    type: SET_IS_CLASS_BEGIN,
    payload: isClassBegin,
  });

const setStudentCount = count => {
  store.dispatch({
    type: SET_STUDENT_COUNT,
    payload: {
      studentCount: count,
    },
  });
};

const setVideoLayout = isVideoLayout =>
  store.dispatch({
    type: SWITCH_LAYOUT,
    payload: {
      isVideoLayout,
    },
  });

const exchangeOne2oneVideoLayout = (isExchangeOne2oneLayout, isFoldedOne2oneLayout = false) =>
  store.dispatch({
    type: EXCHANGE_ONE2ONELAYOUT,
    payload: {
      isExchangeOne2oneLayout,
      isFoldedOne2oneLayout,
    },
  });

const initClassRoomState = () => {
  store.dispatch({
    type: INIT_CLASSROOM_STATE,
  });
};

const setPageOrientation = pageOrientation => {
  store.dispatch({
    type: SET_PAGE_ORIENTATION,
    payload: {
      pageOrientation,
    },
  });
};

export default {
  setRoomStatus,
  beginClass,
  setIsClassBegin,
  setStudentCount,
  setVideoLayout,
  exchangeOne2oneVideoLayout,
  initClassRoomState,
  setPageOrientation,
};
