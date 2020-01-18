import React, { Component } from 'react';
import { YsGlobal } from '@global/handleGlobal';
import { liveRoom, EVENT_TYPE, PUBLISH_STATE } from '@global/roomConstants';
import Signalling from '@global/services/SignallingService';
import DeviceService from '@global/services/DeviceService';
import Actions from '@global/actions';
import { connect } from 'react-redux';
import { myself } from '@utils/';
const { isMobile } = YsGlobal;
const applyForWheatLan = YsGlobal.languageInfo.applyForWheat;
class ApplyForWheat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowWheatBtn: false,
      applyWheat: 0, // 0: 申请，1：等待同意申请
      isShowDialog: false,
      isAllowApply: false,
    };
    this.listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
  }

  componentDidMount() {
    liveRoom.addEventListener(EVENT_TYPE.roomUserPropertyChanged, this.updateStreamList.bind(this), this.listernerBackupid);
    liveRoom.addEventListener(EVENT_TYPE.roomPubmsg, this.handlerRoomPubmsg.bind(this), this.listernerBackupid); // roomPubmsg事件
    liveRoom.addEventListener(EVENT_TYPE.roomDelmsg, this.handlerRoomDelmsg.bind(this), this.listernerBackupid);
    this.initState();
  }

  componentWillUnmount() {
    liveRoom.removeBackupListerner(this.listernerBackupid);
  }

  initState() {
    const TestSortMsg = YsGlobal.msgList.find(item => item.name === `UpperwheatSort`);
    if (TestSortMsg) {
      YsGlobal.msgList = YsGlobal.msgList.filter(item => item.name !== `UpperwheatSort`);
      this.setState({ isShowWheatBtn: true, isAllowApply: true, applyWheat: 0 });
    }
  }

  updateStreamList(streamPublishInfo) {
    if (streamPublishInfo.message.publishstate === PUBLISH_STATE.NONE && streamPublishInfo.userid === myself().id) {
      this.setState({
        isShowWheatBtn: true,
        applyWheat: 0,
      });
    }
  }

  // 接收发布信令
  handlerRoomPubmsg({ message }) {
    switch (message.name) {
      case 'UpperwheatSort': {
        // 发起排序器
        this.setState({ isShowWheatBtn: true, isAllowApply: true, applyWheat: 0 });
        this.props.clickConfirmBtn('waiting');
        const chatObj = {
          msgtype: 'notice',
          data: { test: applyForWheatLan.applicationon },
          id: new Date().getTime(),
        };
        this.props.addChatList(chatObj);
        break;
      }
      case 'allowUpperwheat': {
        if (!message.data.isAllow) {
          const chatObj = {
            msgtype: 'notice',
            data: { test: applyForWheatLan.applicationFailed },
            id: new Date().getTime(),
          };
          this.props.addChatList(chatObj);
        } else {
          const chatObj = {
            msgtype: 'notice',
            data: { test: `${message.data.name}${applyForWheatLan.hasVideo}` },
            id: new Date().getTime(),
          };
          this.props.addChatList(chatObj);
        }
        if (message.data.id === myself().id) {
          this.setState({ isShowWheatBtn: !message.data.isAllow });
          this.props.clickConfirmBtn(message.data.isAllow);
          if (!message.data.isAllow) {
            this.setState({ applyWheat: 0 });
          }
          const actions = {
            [myself().id]: '',
          };
          Signalling.sendSignallingApplyShowmine(this.listernerBackupid, 1, actions, myself().id);
          // 发送聊天提示消息
        }
        break;
      }
    }
  }

  // 接收删除信令
  handlerRoomDelmsg({ message }) {
    switch (message.name) {
      case 'UpperwheatSort': {
        this.setState({ isShowWheatBtn: false, isAllowApply: false, applyWheat: 0 });
        const chatObj = {
          msgtype: 'notice',
          data: { test: applyForWheatLan.applicationoff },
          id: new Date().getTime(),
        };
        this.props.addChatList(chatObj);
        break;
      }
      default:
        break;
    }
  }

  // 申请上麦函数
  applyWheatFn() {
    const firstWheat = localStorage.getItem('firstTimeWheat');
    this.setState({
      isShowDialog: false,
    });
    if (this.state.applyWheat === 0 || firstWheat === 'false') {
      this.props.activeToggle('deviceSetting');
      this.props.chengeIsCheckMore(true);
      DeviceService.getDevicesList();
      this.setState({ applyWheat: 1 });
    }
  }

  showDialogFn() {
    if (this.props.confirmState === 'clicked') return;
    const firstWheat = localStorage.getItem('firstTimeWheat');
    if (isMobile || firstWheat === 'true') {
      this.setState({ isShowDialog: false });
      this.props.clickConfirmBtn('clicked');
      const myselfinfo = myself();
      const actions = {
        [myself().id]: JSON.stringify({ id: myself().id, name: myself().nickname, time: new Date().getTime() }),
      };
      Signalling.sendSignallingApplyShowmine(this.listernerBackupid, 0, actions, myselfinfo.id);
      this.setState({ applyWheat: 1 });
      return;
    }
    this.setState({ isShowDialog: true });
    this.props.changeApplyWheat(true);
  }

  render() {
    const { isShowWheatBtn, isShowDialog, isAllowApply } = this.state;
    const { confirmState } = this.props;
    const bannerInner = confirmState === 'clicked' ? applyForWheatLan.WaitingWheat : applyForWheatLan.ApplicationWheat;
    return (
      <div>
        <div className="detectionDialog" style={{ display: isShowDialog && !isMobile ? 'block' : 'none' }}>
          <div className="top_title">
            <i
              className="icon icon-del"
              onClick={() => {
                this.setState({ isShowDialog: false });
              }}
            />
          </div>
          <div className="container">{applyForWheatLan.wrong}</div>
          <div className="bottom">
            <button
              onClick={() => {
                this.setState({ isShowDialog: false });
              }}
            >
              {applyForWheatLan.cancel}
            </button>
            <button onClick={this.applyWheatFn.bind(this)}>{applyForWheatLan.sure}</button>
          </div>
        </div>
        <div className="NoPermission" style={{ display: isShowDialog && !isMobile ? 'block' : 'none' }}></div>
        <div
          className={`ApplyBtn ${isMobile ? 'molileApplyBtn' : 'pcApplyBtn'}`}
          style={{ display: isShowWheatBtn && isAllowApply ? 'flex' : 'none' }}
          onClick={this.showDialogFn.bind(this)}
        >
          <span>{bannerInner}</span>
        </div>
      </div>
    );
  }
}

const mapstateToProps = state => ({
  applyWheat: JSON.stringify(state.Modules.applyWheat),
  confirmState: state.device.settingConfirmBtnState,
});

const mapDispatchToProps = dispatch => ({
  activeToggle: type => {
    Actions.toggleNavbar(type);
  },
  changeApplyWheat: data => {
    Actions.applyWheatState(data);
  },
  clickConfirmBtn: state => {
    Actions.setConfirmBtnState(state);
  },
  addChatList: data => {
    dispatch(Actions.addChatList(data));
  },
  chengeIsCheckMore: data => {
    Actions.toggleIscheckMore(data);
  },
});

export default connect(mapstateToProps, mapDispatchToProps)(ApplyForWheat);
