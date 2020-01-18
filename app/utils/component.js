
/**
 * 对比组件状态是否需要更新
 * @param {Object} state 当前状态 可以传入props|state
 * @param {Object} nextState 更新后的状态nextProps|nextState
 */
export function compare(state, nextState) {
  if (state && nextState && Object.keys(state).length === Object.keys(nextState).length) {
    const keys = Object.entries(state).filter(([key, value]) => typeof value !== 'function').map(([key]) => key);
    for (const index in keys) {
      const key = keys[index];
      const stateVal = state[key];
      const nextVal = nextState[key];
      if (stateVal instanceof Object && nextVal instanceof Object) {
        try {
          if (JSON.stringify(stateVal) !== JSON.stringify(nextVal)) return true;
        } catch {
          if (stateVal !== nextVal) return true;
        }
      }
      if (stateVal !== nextVal) return true;
    }
  }
  return false;
}
