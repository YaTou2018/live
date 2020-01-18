import store from '@app/store';
import { SET_DEVICELIST, SET_SYSTEMINFO, UPDATE_DEVICELIST, SET_CONFIRMBTNSTATE } from '../actionTypes/device';

const setDeviceList = devicesInfo =>
  store.dispatch({
    type: SET_DEVICELIST,
    payload: {
      devicesInfo,
    },
  });

const setSystemInfo = systemInfo =>
  store.dispatch({
    type: SET_SYSTEMINFO,
    payload: {
      systemInfo,
    },
  });
const updateDeviceList = data =>
  store.dispatch({
    type: UPDATE_DEVICELIST,
    payload: {
      ...data,
    },
  });

const setConfirmBtnState = state =>
  store.dispatch({
    type: SET_CONFIRMBTNSTATE,
    payload: state,
  });

export default {
  setDeviceList,
  setSystemInfo,
  updateDeviceList,
  setConfirmBtnState,
};
