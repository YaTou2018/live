/**
 * @description 正在共享界面
 * @author chenxx
 * @date 2019/5/24
 */

import './static/sass/index.scss';
import React, { Component } from 'react';
import { liveRoom, EVENT_TYPE } from '@global/roomConstants';
import { YsGlobal } from '@global/handleGlobal';
import SendElectronMsg from '@global/services/SendElectronMsg';

const { shareDeskTop } = YsGlobal.languageInfo;
const { clientDesk } = shareDeskTop;
export default class DeskTopSharing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlayFlag: false,
      isMe: false,
      screenStream: undefined,
      touching: false,
      start: null,
      fingers: 0, // 屏幕上手指数量
      scale: 1,
      movex: 0,
      movey: 0,
      lastEnd: {
        lastEnd_scale: 1,
        lastEnd_time: undefined,
        lastEnd_x: 0,
        lastEnd_y: 0,
      },
    };
    this.listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    this.prect = {};
  }

  componentDidMount() {
    liveRoom.addEventListener('room-userscreenstate-changed', this.roomUserscreenstateChanged.bind(this), this.listernerBackupid);
    liveRoom.addEventListener('room-disconnected', this.handlerRoomDisconnectedScreen.bind(this), this.listernerBackupid);
    liveRoom.addEventListener('room-delmsg', this.handlerRoomDelmsg.bind(this), this.listernerBackupid);
    liveRoom.addEventListener(EVENT_TYPE.roomUserPropertyChanged, this.handleUserPropertyChanged, this.listernerBackupid);
  }

  componentWillUnmount() {
    if (this.state.isPlayFlag && this.state.screenStream && this.state.screenStream.streamUserId) {
      liveRoom.unplayRemoteScreen(this.state.screenStream.streamUserId);
    }
    liveRoom.removeBackupListerner(this.listernerBackupid);
  }

  endScreenShare = () => {
    this.setState({
      isPlayFlag: false,
    });
    // eslint-disable-next-line no-unused-expressions
    liveRoom.stopShareScreen && liveRoom.stopShareScreen();
  };

  handleTouchstartEvent(event) {
    if (!this.state.isPlayFlag || !this.state.screenStream) {
      this.setState({
        lastEnd: {
          lastEnd_scale: 1,
          lastEnd_time: undefined,
          lastEnd_x: 0,
          lastEnd_y: 0,
        },
      });
      return;
    }
    this.prect = document.getElementById('screenStreamContainer').getBoundingClientRect();
    this.setState({
      touching: true,
      start: event.touches,
      fingers: event.touches.length,
    });
  }

  handleTouchmoveEvent(event) {
    event.preventDefault();
    if (!this.state.touching || !this.state.screenStream) return;
    const $touch = document.getElementById(`screen${this.state.screenStream.streamUserId}`);
    $touch.style.transition = '';
    const now = event.touches;
    const fingers = now.length;
    if (fingers === 2) {
      // 得到缩放比例
      let scale = this.getDistance(now[0], now[1]) / this.getDistance(this.state.start[0], this.state.start[1]);
      let translateStr = `translate(${this.state.movex}px, ${this.state.movey}px)`;
      scale = scale + this.state.lastEnd.lastEnd_scale - 1;
      if (scale < 0.9 || (scale > 1.1 && scale <= 3)) {
        this.setState(
          {
            scale: parseFloat(scale.toFixed(2)),
          },
          () => {
            const origin = {
              x: (this.state.start[0].pageX + this.state.start[1].pageX) / 2,
              y: (this.state.start[0].pageY + this.state.start[1].pageY) / 2,
            };
            if (this.props.isFullScreen) {
              translateStr = `translate(${this.state.movey}px, ${-this.state.movex}px)`;
              $touch.style['transform-origin'] = `50% 50% 0`;
            } else {
              $touch.style['transform-origin'] = `${origin.x}px ${origin.y}px`;
            }
            translateStr = scale > 1 ? translateStr : '';
            $touch.style.transform = `${translateStr} scale(${this.state.scale})`;
          },
        );
      }
    } else if (fingers === 1) {
      // 移动元素
      if (this.state.scale <= 1) return;
      this.moveTouch(now[0]);
    }
    this.setState({
      fingers,
    });
  }

  handleTouchendEvent(event) {
    const $touch = document.getElementById(`screen${this.state.screenStream.streamUserId}`);
    $touch.style.transition = 'all 0.5s ease';
    let { movex, movey } = this.state;
    if (this.state.fingers === 2 && this.state.scale <= 1) {
      this.setState({
        scale: 1,
      });
      movex = 0;
      movey = 0;
      $touch.style.transform = `scale(1)`;
    } else {
      const { prect } = this;
      const crect = $touch.getBoundingClientRect();
      const cleft = crect.left;
      const cright = crect.right;
      const cbottom = crect.bottom;
      const ctop = crect.top;
      if (prect.width - cright > 0 || cleft > 0 || ctop > 0 || prect.height - cbottom > 0) {
        if (prect.width - cright > 0) {
          movex += prect.width - cright;
        }
        if (cleft > 0) {
          movex -= cleft;
        }
        if (ctop > 0) {
          movey -= ctop;
        }
        if (prect.height - cbottom > 0) {
          movey += prect.height - cbottom;
        }
        if (this.props.isFullScreen) {
          $touch.style.transform = `translate(${movey}px, ${-movex}px) scale(${this.state.scale})`;
        } else {
          $touch.style.transform = `translate(${movex}px, ${movey}px) scale(${this.state.scale})`;
        }
      }
    }
    // 双击事件
    const endTime = new Date().getTime();
    if (this.state.lastEnd.lastEnd_time && endTime - this.state.lastEnd.lastEnd_time <= 300) {
      event.preventDefault();
    }

    this.setState({
      touching: false,
      movex,
      movey,
      lastEnd: {
        lastEnd_scale: this.state.scale,
        lastEnd_time: endTime,
        lastEnd_x: movex,
        lastEnd_y: movey,
      },
    });
  }

  moveTouch(nowTouch) {
    const startX = this.state.start[0].pageX;
    const startY = this.state.start[0].pageY;
    const nowX = nowTouch.pageX;
    const nowY = nowTouch.pageY;

    const $touch = document.getElementById(`screen${this.state.screenStream.streamUserId}`);
    const moveX = nowX - startX;
    const moveY = nowY - startY;
    if (Math.abs(moveX) <= 5 && Math.abs(moveY) <= 5) return;
    this.setState(
      {
        movex: nowX - startX + this.state.lastEnd.lastEnd_x,
        movey: nowY - startY + this.state.lastEnd.lastEnd_y,
      },
      () => {
        if (this.props.isFullScreen) {
          $touch.style.transform = `translate(${this.state.movey}px, ${-this.state.movex}px) scale(${this.state.scale})`;
        } else {
          $touch.style.transform = `translate(${this.state.movex}px, ${this.state.movey}px) scale(${this.state.scale})`;
        }
      },
    );
  }

  /* 获取两点之间的距离 */
  getDistance(p1, p2) {
    const x = p2.pageX - p1.pageX;
    const y = p2.pageY - p1.pageY;
    return Math.sqrt(x * x + y * y);
  }

  /* 处理用户属性改变 */
  handleUserPropertyChanged = data => {
    const { user, message } = data;
    const { isPlayFlag, isMe } = this.state;
    const mySelf = liveRoom.getMySelf() || {};
    if (user.id === mySelf.id) {
      for (const [key, value] of Object.entries(message)) {
        if (key === 'candraw' && !value && isPlayFlag && isMe) {
          liveRoom.stopShareScreen();
        }
      }
    }
  };

  roomUserscreenstateChanged(data) {
    const { message } = data;
    const { type, attributes, published } = message;
    const electronSourceId = attributes.electronSourceId || '';
    if (type === 'screen') {
      if (published) {
        if (message.userId === liveRoom.getMySelf().id) {
          this.setState({
            isPlayFlag: true,
            screenStream: undefined,
            isMe: true,
          });
          if (electronSourceId.includes('screen')) {
            SendElectronMsg.showDesktopMask();
          }
        } else {
          this.setState({
            isPlayFlag: true,
            screenStream: { streamUserId: message.userId, type },
            isMe: false,
          });
          liveRoom.playRemoteScreen(message.userId, `screen${message.userId}`, { loader: true });
        }
      } else {
        this.setState({
          isPlayFlag: false,
          screenStream: undefined,
          isMe: message.userId === liveRoom.getMySelf().id,
        });
        liveRoom.unplayRemoteScreen(message.userId);
        SendElectronMsg.hideDesktopMask();
      }
    }
  }

  handlerRoomDisconnectedScreen() {
    this.setState({
      isPlayFlag: false,
      screenStream: undefined,
    });
  }

  handlerRoomDelmsg({ message }) {
    const handlers = {
      ClassBegin: () => {
        if (this.state.isPlayFlag) {
          this.setState({
            isPlayFlag: false,
          });
          liveRoom.stopShareScreen();
        }
      },
    };
    (handlers[message.name] || (() => {}))();
  }

  render() {
    const { isPlayFlag, isMe, screenStream } = this.state;
    return (
      <React.Fragment>
        {isPlayFlag && (isMe || screenStream) ? (
          <article
            style={{ display: isPlayFlag ? 'block' : 'none' }}
            className={`desktop-share-container ${isMe ? 'desktop-share-container-bg' : ''}`}
            id="screenStreamContainer"
          >
            {isMe ? (
              <button className="screen-share-wrap_button" onClick={this.endScreenShare}>
                {clientDesk.ensShare}
              </button>
            ) : (
              <div
                className="screen-share-all"
                id={screenStream ? `screen${screenStream.streamUserId}` : ''}
                onTouchStart={this.handleTouchstartEvent.bind(this)}
                onTouchMove={this.handleTouchmoveEvent.bind(this)}
                onTouchEnd={this.handleTouchendEvent.bind(this)}
              />
            )}
          </article>
        ) : null}
      </React.Fragment>
    );
  }
}
