import store from '@app/store';
import {
  SET_LUCKYSTATUS,
  SET_LUCKYDATA,
  SET_VOTESTATUS,
  SET_VOTEDATA,
  SET_ANSWERSTATUS,
  SET_ANSWERDATA,
  SET_SHARESTATUS,
  SET_SHAREDATA,
  SET_CALLROLLSTATUS,
  SET_CALLROLLDATA,
  SET_ANNOUNCEMENTSTATUS,
  SET_ANNOUNCEMENTDATA,
  SET_LUCKYCOUNTNUM,
  SET_UPDATAPICTURE,
  SET_MOBILE_PAGE_ZZC, // 手机端遮罩层
  SET_MP4_FULL, // 视频全屏
  INIT_MODULES_STATE,
  SET_APPLY_WHEAT,
  SET_MCRO_PLAY,
} from '../actionTypes/Modules';

const moduleNames = {
  share: {
    status: SET_SHARESTATUS,
    data: SET_SHAREDATA,
  },
  callRoll: {
    status: SET_CALLROLLSTATUS,
    data: SET_CALLROLLDATA,
  },
  luckyDraw: {
    status: SET_LUCKYSTATUS,
    data: SET_LUCKYDATA,
  },
  vote: {
    status: SET_VOTESTATUS,
    data: SET_VOTEDATA,
  },
  announcement: {
    status: SET_ANNOUNCEMENTSTATUS,
    data: SET_ANNOUNCEMENTDATA,
  },
  answer: {
    status: SET_ANSWERSTATUS,
    data: SET_ANSWERDATA,
  },
};

const setModuleStatus = (moduleName, status) => {
  store.dispatch({
    type: moduleNames[moduleName].status,
    payload: status,
  });
};

const setModuleData = (moduleName, data) => {
  store.dispatch({
    type: moduleNames[moduleName].data,
    payload: data,
  });
};

const setCallRollStatues = data => {
  return store.dispatch({
    type: SET_CALLROLLSTATUS,
    payload: data,
  });
};

const luckyDrawCount = data =>
  store.dispatch({
    // eslint-disable-next-line no-undef
    type: SET_LUCKYCOUNTNUM,
    payload: data,
  });

// 上传图片
const updataPicCount = data => {
  store.dispatch({
    type: SET_UPDATAPICTURE,
    payload: data,
  });
};

const isShowMobilemask = data => {
  store.dispatch({
    type: SET_MOBILE_PAGE_ZZC,
    payload: data,
  });
};

const changeAllFull = data => {
  store.dispatch({
    type: SET_MP4_FULL,
    payload: data,
  });
};
const initModulesState = () => {
  store.dispatch({
    type: INIT_MODULES_STATE,
  });
};

const applyWheatState = data => {
  store.dispatch({
    type: SET_APPLY_WHEAT,
    payload: data,
  });
};

const isplayMicro = data => {
  store.dispatch({
    type: SET_MCRO_PLAY,
    payload: data,
  });
}
export default {
  setModuleStatus,
  setModuleData,
  setCallRollStatues,
  luckyDrawCount,
  updataPicCount,
  isShowMobilemask,
  changeAllFull,
  initModulesState,
  applyWheatState,
  isplayMicro,
};
