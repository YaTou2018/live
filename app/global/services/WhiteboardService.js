import { liveRoom } from '@global/roomConstants';
class WhiteboardService {
  constructor() {
    this.ysWhiteBoardManager = undefined;
  }

  getYsWhiteBoardManager() {
    return this.ysWhiteBoardManager;
  }

  setYsWhiteBoardManager(value) {
    this.ysWhiteBoardManager = value;
  }
}
export default new WhiteboardService();
