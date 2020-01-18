import store from '@app/store';
import { SET_USER_LIST, SET_ONLINE_USER_NUM, SET_ONLINE_STUDENT_NUM, SET_TEACHER_ID } from '../actionTypes/user';

const setUserList = userList =>
  store.dispatch({
    type: SET_USER_LIST,
    payload: {
      userList,
    },
  });

const setOnlineUserNum = onlineNum =>
  store.dispatch({
    type: SET_ONLINE_USER_NUM,
    payload: {
      onlineNum,
    },
  });

const setOnlineStudentNum = onlineStudentNum =>
  store.dispatch({
    type: SET_ONLINE_STUDENT_NUM,
    payload: {
      onlineStudentNum,
    },
  });

const setTeacherId = teacherId => {
  store.dispatch({
    type: SET_TEACHER_ID,
    payload: {
      teacherId,
    },
  });
};

export default {
  setUserList,
  setOnlineUserNum,
  setOnlineStudentNum,
  setTeacherId,
};
