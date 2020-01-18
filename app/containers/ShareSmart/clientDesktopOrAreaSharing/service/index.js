import { liveRoom } from '@global/roomConstants';

export default class Index {
  constructor(props) {
    this.props = props;
    liveRoom.addEventListener('programmShare', this.handlerProgrammShare.bind(this));
    liveRoom.addEventListener('DisconnectionRoom', this.handleDisconnectionRoom.bind(this));
    liveRoom.addEventListener('room-delmsg', this.handlerRoomDelmsg.bind(this)); // roomDelmsg事件 下课事件
  }

  /* 侦听工具箱桌面共享按钮事件 */
  handlerProgrammShare() {
    this.props.callback.setStateCallback({
      modeStatuses: 1,
      programmShare: true,
    });
  }

  handleDisconnectionRoom() {
    this.wsToggle(false);
    this.props.callback.setStateCallback({
      programmShare: false,
    });
    // 关闭共享页面，启用工具箱按钮
    liveRoom.dispatchEvent({
      type: 'colse-holdAll-item',
      message: {
        type: 'sharing',
      },
    });
  }

  handlerRoomDelmsg({ message }) {
    const handlers = {
      ClassBegin: () => {
        if (this.props.callback.getStateCallback('programmShare')) {
          this.wsToggle(false);
          this.props.callback.setStateCallback({
            programmShare: false,
          });
        }
      },
    };
    (handlers[message.name] || (() => {}))();
  }

  wsToggle(status) {
    // true:开，false:关
    // if (YsGlobal && YsGlobal.isClient && !YsGlobal.isMacClient) {
    if (status) {
      // liveRoom.getNativeInterface && liveRoom.getNativeInterface() && liveRoom.getNativeInterface().createShareScreenWindow(400, 300, window.innerWidth / 2 - 500, window.innerHeight / 2 - 150, false, false, this.shareFailure, YsConstant.joinRoomInfo.sharedMouseLocus);//区域描述
    } else {
      liveRoom.getNativeInterface && liveRoom.getNativeInterface() && liveRoom.getNativeInterface().destroyShareScreenWindow();
    }
    // }
  }

  startShareService(modeStatuses) {
    // ServiceTools.stopAllMediaShare();
    if (modeStatuses === 1) {
      // liveRoom.getNativeInterface && liveRoom.getNativeInterface() && liveRoom.getNativeInterface().createShareScreenWindow(0, 0, 0, 0, false, false, this.shareFailure, YsConstant.joinRoomInfo.sharedMouseLocus);
    }
    liveRoom.getNativeInterface && liveRoom.getNativeInterface() && liveRoom.getNativeInterface().startShareScreen(this.shareFailure);
    liveRoom.dispatchEvent({
      type: 'hasToolBox',
      message: {
        isHasToolBox: false,
      },
    });
  }

  shareFailure(e) {
    console.error(`Share the failure${e}`);
  }
}
