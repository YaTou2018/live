import { liveRoom } from '@global/roomConstants';

export default class DeskTopSharingService {
  constructor(props) {
    this.props = props;
    liveRoom.addEventListener('room-userscreenstate-changed', this.roomUserscreenstateChanged.bind(this), this.props.listernerBackupid);
    liveRoom.addEventListener('room-disconnected', this.handlerRoomDisconnectedScreen.bind(this), this.props.listernerBackupid);
    liveRoom.addEventListener('room-delmsg', this.handlerRoomDelmsg.bind(this), this.props.listernerBackupid);
  }

  roomUserscreenstateChanged({ message }) {
    if (message.type === 'screen') {
      if (message.published) {
        if (message.userId === liveRoom.getMySelf().id) {
          this.props.callback.setStateCallback({
            isPlayFlag: true,
            screenStream: undefined,
            isMe: true,
          });
        } else {
          this.props.callback.setStateCallback({
            isPlayFlag: true,
            screenStream: { streamUserId: message.userId, type: message.type },
            isMe: false,
          });
          liveRoom.playRemoteScreen(message.userId, `screen${message.userId}`, { loader: true });
        }
      } else {
        this.props.callback.setStateCallback({
          isPlayFlag: false,
          screenStream: undefined,
          isMe: message.userId === liveRoom.getMySelf().id,
        });
        liveRoom.unplayRemoteScreen(message.userId);
      }
    }
  }

  handlerRoomDisconnectedScreen() {
    this.props.callback.setStateCallback({
      isPlayFlag: false,
      screenStream: undefined,
    });
  }

  handlerRoomDelmsg({ message }) {
    const handlers = {
      ClassBegin: () => this.props.callback.getStateCallback('isPlayFlag') && this._unScreenSharing(),
    };
    (handlers[message.name] || (() => {}))();
  }

  _unScreenSharing = () => {
    this.props.callback.setStateCallback({
      isPlayFlag: false,
    });
    // if (this.props.callback.getStateCallback('isMe') && liveRoom.getNativeInterface && liveRoom.getNativeInterface()) {
    //   liveRoom.getNativeInterface().stopShareScreen();
    // }
    // eslint-disable-next-line no-unused-expressions
    liveRoom.stopShareScreen && liveRoom.stopShareScreen();
  };
}
