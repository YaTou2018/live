import {
  SET_VIDEO_DRAG_INFO,
  SET_STUDENT_STREAM_LIST,
  DELETE_VIDEO_DRAG_INFO,
  SET_DOUBLE_VIDEO_ID,
  SET_TEACHER_USER_STREAM,
  INIT_VIDEO_STATE,
} from '../actionTypes/video';

const initialState = {
  videoDragInfo: {},
  studentStreamList: [],
  doubleVideoId: '',
  teacherUserStream: {},
};

export default function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_VIDEO_DRAG_INFO: {
      return {
        ...state,
        videoDragInfo: {
          ...state.videoDragInfo,
          [payload.videoDragInfo.userId]: payload.videoDragInfo,
        },
      };
    }
    case DELETE_VIDEO_DRAG_INFO: {
      const videoDragInfo = JSON.parse(JSON.stringify(state.videoDragInfo));
      delete videoDragInfo[payload.userId];
      return {
        ...state,
        videoDragInfo,
      };
    }
    case SET_STUDENT_STREAM_LIST: {
      return {
        ...state,
        studentStreamList: payload.studentStreamList,
      };
    }
    case SET_DOUBLE_VIDEO_ID: {
      return {
        ...state,
        doubleVideoId: payload.doubleVideoId,
      };
    }
    case SET_TEACHER_USER_STREAM: {
      return {
        ...state,
        teacherUserStream: payload.teacherUserStream,
      };
    }
    case INIT_VIDEO_STATE: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
