import store from '@app/store';
import { SET_NETWORK_STATE } from '../actionTypes/ys';

const setNetworkState = networkStatus =>
  store.dispatch({
    type: SET_NETWORK_STATE,
    payload: {
      netquality: networkStatus.video.netquality || networkStatus.audio.netquality,
      delay: networkStatus.video.currentDelay || networkStatus.audio.currentDelay,
      packetsLostRate: networkStatus.video.packetsLostRate || networkStatus.audio.packetsLostRate,
    },
  });

export default {
  setNetworkState,
};
