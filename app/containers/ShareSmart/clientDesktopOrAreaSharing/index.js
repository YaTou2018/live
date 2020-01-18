/**
 * @description 客户端共享类型选择
 * @author chenxx
 * @date 2019/5/28
 */

import React from 'react';
import { liveRoom } from '@global/roomConstants';
// import ReactDrag from 'reactDrag';
import { YsGlobal } from '@global/handleGlobal';
import ClientDesktopOrAreaSharingService from './service/index';
import './static/sass/index.scss';

const { shareDeskTop } = YsGlobal.languageInfo;
const { clientDesk } = shareDeskTop;

export default class ClientDesktopOrAreaSharing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modeStatuses: 1, // 0:区域共享、1:桌面共享
      programmShare: false,
    };
    this.listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
  }

  componentDidMount() {
    // 在完成首次渲染之前调用，此时仍可以修改组件的state
    this.service = new ClientDesktopOrAreaSharingService({
      listernerBackupid: this.listernerBackupid,
      callback: {
        setStateCallback: param => this.setState(param),
        getStateCallback: name => this.state[name],
      },
    });
  }

  // 在组件完成更新后立即调用,在初始化时不会被调用
  componentDidUpdate(prevProps, prevState) {
    if (prevState.programmShare !== this.state.programmShare && this.state.programmShare) {
      this.setDefaultPosition();
    }
  }

  componentWillUnmount() {
    // eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid);
  }

  // 切换共享模式
  changeMode(modeStatuses) {
    if (modeStatuses === this.state.modeStatuses) return;
    if (modeStatuses === 0) {
      // 区域共享
      this.service.wsToggle(true); // 开启区域窗口
    } else if (modeStatuses === 1) {
      // 桌面共享
      this.service.wsToggle(false); // 关闭区域窗口
    } else {
      return;
    }
    this.setState({
      modeStatuses,
    });
  }

  startShare() {
    this.setState({
      programmShare: false,
    }); // 关闭本页
    this.service.startShareService(this.state.modeStatuses);
  }

  clickCloseProgrammShare() {
    this.service.wsToggle(false);
    this.setState({
      programmShare: false,
    }); // 关闭本页

    // 关闭共享页面，启用工具箱按钮
    liveRoom.dispatchEvent({
      type: 'colse-holdAll-item',
      message: {
        type: 'sharing',
      },
    });
  }

  /* 设置初始位置 */
  setDefaultPosition() {
    const { id, draggableData } = this.props;
    const dragNode = document.getElementById(id);
    const boundNode = document.querySelector(draggableData.bounds);
    if (dragNode && boundNode) {
      if (draggableData.changePosition && typeof draggableData.changePosition === 'function') {
        const isSendSignalling = false;
        draggableData.changePosition(id, { percentLeft: 0.5, percentTop: 0.5, isDrag: false }, isSendSignalling);
      }
    }
  }

  render() {
    const { id /* programmShareDrag, draggableData */ } = this.props;
    // let DraggableData = Object.customAssign({
    //     id: id,
    //     percentPosition: {
    //         percentLeft: programmShareDrag.percentLeft || 0.5,
    //         percentTop: programmShareDrag.percentTop || 0.5
    //     },
    // }, draggableData);
    return (
      // <ReactDrag {...DraggableData}>
      <div id={id} className="programm-share" style={{ display: this.state.programmShare ? 'block' : 'none' }}>
        <div className="programm-share-title">
          <h3 className="programm-share-name">{clientDesk.chooseShare}</h3>
          <button className="programm-share-close" onClick={this.clickCloseProgrammShare.bind(this)} />
        </div>
        <div className="programm-share-body">
          <div className="programm-share-item-box" onClick={this.changeMode.bind(this, 0)}>
            <div className={`area-share-img ${this.state.modeStatuses === 0 ? 'area-share-img-active' : ''}`} />
            <span className="programm-share-btn">{clientDesk.areaShare}</span>
          </div>
          <div className="programm-share-item-box" onClick={this.changeMode.bind(this, 1)}>
            <div className={`screen-share-img ${this.state.modeStatuses === 1 ? 'screen-share-img-active' : ''}`} />
            <span className="programm-share-btn">{clientDesk.deskShare}</span>
          </div>
          {window.screen.width > 1920 && this.state.modeStatuses[1] ? (
            <p className="screen_width_tip">{clientDesk.suggest}</p>
          ) : (
            undefined
          )}
          <button className="programm-share-start-btn" onClick={this.startShare.bind(this)}>
            {clientDesk.startShare}
          </button>
        </div>
      </div>
      // </ReactDrag>
    );
  }
}
