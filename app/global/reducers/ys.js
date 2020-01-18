import { SET_NETWORK_STATE } from '../actionTypes/ys';

const initialState = {
  // 网络状态
  networkState: {
    netquality: 1,
    delay: 0,
    packetsLostRate: 0,
  },
};

export default function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_NETWORK_STATE: {
      return {
        ...state,
        networkState: {
          ...state.networkState,
          netquality: payload.netquality,
          delay: payload.delay,
          packetsLostRate: payload.packetsLostRate,
        },
      };
    }
    default: {
      return state;
    }
  }
}
