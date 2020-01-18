import { ROOM_STATE, ROOM_TYPE } from '@global/roomConstants';
import { getUrlParams } from '../../utils/url';
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

const isMobile = navigator.userAgent.match(/AppleWebKit.*Mobile.*/);
const roomType = parseInt(getUrlParams('roomtype'), 10);
const initialState = {
  roomStatus: ROOM_STATE.INIT, // connected 房间链接成功
  classBeginTime: '',
  isClassBegin: '',
  studentCount: 0,
  isVideoLayout: roomType === ROOM_TYPE.MEETING_ROOM && !isMobile,
  isExchangeOne2oneLayout: false,
  isFoldedOne2oneLayout: false,
  pageOrientation: 0,
};

export default function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ROOM_STATUS: {
      return {
        ...state,
        roomStatus: payload,
      };
    }
    case SET_IS_CLASS_BEGIN: {
      return {
        ...state,
        isClassBegin: payload,
      };
    }
    case BEGIN_CLASS: {
      return {
        ...state,
        classBeginTime: payload.time,
      };
    }
    case SET_STUDENT_COUNT: {
      return {
        ...state,
        studentCount: payload.studentCount,
      };
    }
    case SWITCH_LAYOUT: {
      return {
        ...state,
        isVideoLayout: payload.isVideoLayout,
      };
    }
    case EXCHANGE_ONE2ONELAYOUT: {
      return {
        ...state,
        isExchangeOne2oneLayout: payload.isExchangeOne2oneLayout,
        isFoldedOne2oneLayout: payload.isFoldedOne2oneLayout,
      };
    }
    case SET_PAGE_ORIENTATION: {
      return {
        ...state,
        pageOrientation: payload.pageOrientation,
      };
    }
    case INIT_CLASSROOM_STATE: {
      return {
        ...state,
        classBeginTime: '',
        isClassBegin: '',
        studentCount: 0,
        isVideoLayout: false,
      };
    }
    default: {
      return state;
    }
  }
}
