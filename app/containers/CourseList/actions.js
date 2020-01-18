import store from '@app/store';
import { SET_FILE_LIST, UPDATE_FILE_LIST, SORT_FILE_LIST, OPEN_DOCUMENT, CURRENT_FILE, UPLOADING_PPT } from './action-type';

const setFileList = fileList =>
  store.dispatch({
    type: SET_FILE_LIST,
    payload: {
      fileList,
    },
  });
const updateFileList = fileList =>
  store.dispatch({
    type: UPDATE_FILE_LIST,
    payload: {
      fileList,
    },
  });

const sortFileList = data =>
  store.dispatch({
    type: SORT_FILE_LIST,
    payload: {
      ...data,
    },
  });
const openDocument = data =>
  store.dispatch({
    type: OPEN_DOCUMENT,
    payload: {
      ...data,
    },
  });

// 是否正在上传ppt课件
const currentIsUpFile = data =>
  store.dispatch({
    type: CURRENT_FILE,
    payload: data,
  });

const uploadingpptFn = data =>
  store.dispatch({
    type: UPLOADING_PPT,
    payload: data,
  });
export default {
  setFileList,
  updateFileList,
  sortFileList,
  openDocument,
  currentIsUpFile,
  uploadingpptFn,
};
