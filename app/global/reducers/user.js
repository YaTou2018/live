import { SET_USER_LIST, SET_ONLINE_USER_NUM, SET_ONLINE_STUDENT_NUM, SET_TEACHER_ID } from '../actionTypes/user';

const initialState = {
  onlineUserNum: 0,
  onlineStudentNum: 0,
  userList: [],
  teacherId: '',
};

export default function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_USER_LIST: {
      return {
        ...state,
        userList: payload.userList,
      };
    }
    case SET_ONLINE_USER_NUM: {
      return {
        ...state,
        onlineUserNum: payload.onlineNum,
      };
    }
    case SET_ONLINE_STUDENT_NUM: {
      return {
        ...state,
        onlineStudentNum: payload.onlineStudentNum,
      };
    }
    case SET_TEACHER_ID: {
      return {
        ...state,
        teacherId: payload.teacherId,
      };
    }
    default: {
      return state;
    }
  }
}
