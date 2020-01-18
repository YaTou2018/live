import store from '@app/store';
import {
  SET_VIDEO_DRAG_INFO,
  SET_STUDENT_STREAM_LIST,
  DELETE_VIDEO_DRAG_INFO,
  SET_DOUBLE_VIDEO_ID,
  SET_TEACHER_USER_STREAM,
  INIT_VIDEO_STATE,
} from '../actionTypes/video';

const setVideoDragInfo = videoDragInfo =>
  store.dispatch({
    type: SET_VIDEO_DRAG_INFO,
    payload: {
      videoDragInfo,
    },
  });

const deleteVideoDragInfo = userId =>
  store.dispatch({
    type: DELETE_VIDEO_DRAG_INFO,
    payload: {
      userId,
    },
  });

const setStudentStreamList = studentStreamList =>
  store.dispatch({
    type: SET_STUDENT_STREAM_LIST,
    payload: {
      studentStreamList,
    },
  });

const setDoubleVideoId = doubleVideoId =>
  store.dispatch({
    type: SET_DOUBLE_VIDEO_ID,
    payload: {
      doubleVideoId,
    },
  });

const setTeacherUserStream = teacherUserStream =>
  store.dispatch({
    type: SET_TEACHER_USER_STREAM,
    payload: {
      teacherUserStream,
    },
  });

const initVideoState = () =>
  store.dispatch({
    type: INIT_VIDEO_STATE,
  });

export default {
  setVideoDragInfo,
  deleteVideoDragInfo,
  setStudentStreamList,
  setDoubleVideoId,
  setTeacherUserStream,
  initVideoState,
};
