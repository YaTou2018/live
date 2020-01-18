import React, { Component } from 'react';
import './static/scss/style.scss';
import { liveRoom, EVENT_TYPE } from '@global/roomConstants';
import Signalling from '@global/services/SignallingService';
import { YsGlobal } from '@global/handleGlobal';
import { connect } from 'react-redux';
import UserService from '@global/services/UserService';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { emitter } from '@utils/';

const applyForWheatLan = YsGlobal.languageInfo.applyForWheat;

class OnWheat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAllow: false, // 是否允许上麦
      onWheatList: [],
      isMaxNum: false,
    };
    this.listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
  }

  componentDidMount() {
    liveRoom.addEventListener(EVENT_TYPE.roomPubmsg, this.handlerRoomPubmsg.bind(this), this.listernerBackupid); // roomPubmsg事件
    liveRoom.addEventListener(EVENT_TYPE.roomDelmsg, this.handlerRoomDelmsg.bind(this), this.listernerBackupid);
    emitter.on('room-msglist', this.msglistHandler.bind(this));
  }

  componentWillUnmount() {
    liveRoom.removeBackupListerner(this.listernerBackupid);
  }

  // 房间msglist信令
  msglistHandler({ data }) {
    data.forEach(value => {
      switch (value.name) {
        case 'UpperwheatSort':
          // 发起排序器
          this.setState({ isAllow: true });
          Signalling.sendSignallingShowmineSubsort(this.listernerBackupid);
          break;
      }
    });
  }

  // 接收发布信令
  handlerRoomPubmsg({ message }) {
    switch (message.name) {
      case 'Server_Sort_Result': {
        // 订阅排序器结果
        let newarr = [];
        if (message.sortResult && message.sortResult.length > 0) {
          newarr = message.sortResult.map(item => {
            return JSON.parse(item[Object.keys(item)[0]]);
          });
        }
        this.setState({ onWheatList: newarr });
        break;
      }
      case 'UpperwheatSort':
        // 发起排序器
        this.setState({ isAllow: true });
        Signalling.sendSignallingShowmineSubsort(this.listernerBackupid);
        break;
      default:
        break;
    }
  }

  // 接收删除信令
  handlerRoomDelmsg({ message }) {
    switch (message.name) {
      case 'UpperwheatSort': {
        this.setState({ isAllow: false });
        Signalling.sendSignallingShowmineCancelsubsort(this.listernerBackupid);
        this.setState({ onWheatList: [] });
        break;
      }
      default:
        break;
    }
  }

  // 直播客老师点击：允许｜禁止【申请上麦】信令
  handleIsAllowUpperwheat() {
    if (!this.state.isAllow) {
      Signalling.sendSignallingShowminePublish();
    } else {
      // 禁止上麦
      Signalling.sendSignallingShowmineDel();
      if (this.props.studentStreamList && this.props.studentStreamList.length) {
        this.props.studentStreamList.forEach(item => {
          UserService.userPlatformUpOrDown(liveRoom.getUser(item.streamUserId) || {});
        });
      }
    }
  }

  // // 全部忽略 学生上麦
  // handleAllnoUpperwheat() {
  //   if (this.state.onWheatList.length > 0) {
  //     this.state.onWheatList.forEach(item => Signalling.sendSignallingAllowUpperwheat({ isAllow: false }, item.id));
  //   }
  // }

  // 允许｜禁止 学生上麦
  handleIntheWheatFn(item, isAllow) {
    if (isAllow) {
      // eslint-disable-next-line no-shadow
      const usersNum = Object.values(liveRoom.getUsers()).filter(item => item.publishstate > 0 && item.role === 2).length;
      if (usersNum >= YsGlobal.roomInfo.maxVideo - 1) {
        this.setState({
          isMaxNum: true,
        });
        setTimeout(() => {
          this.setState({
            isMaxNum: false,
          });
        }, 2000);
        return;
      }
      const user = {
        id: item.id,
        hasaudio: true,
        hasvideo: true,
        publishstate: 0,
        role: 2,
      };
      UserService.userPlatformUpOrDown(user);
      Signalling.sendSignallingAllowUpperwheat({ isAllow, id: item.id, name: item.name });
    } else {
      Signalling.sendSignallingAllowUpperwheat({ isAllow, id: item.id, name: item.name }, item.id);
    }
  }

  timestampToTime(timeData) {
    const hour = new Date(timeData).getHours() > 0 ? new Date(timeData).getHours() : `0${new Date(timeData).getHours()}`;
    const min = new Date(timeData).getMinutes() > 0 ? new Date(timeData).getMinutes() : `0${new Date(timeData).getMinutes()}`;
    const sec = new Date(timeData).getSeconds() > 0 ? new Date(timeData).getSeconds() : `0${new Date(timeData).getSeconds()}`;
    return `${hour}:${min}:${sec}`;
  }

  render() {
    const { isShow } = this.props;
    const { isAllow, onWheatList, isMaxNum } = this.state;

    const Row = ({ index, style }) => {
      const item = onWheatList[index];
      return (
        <div style={style} className="onwheatItem">
          <div className="onwheatItem_left">
            <p className="name">{item.name}</p>
            <p className="time">{this.timestampToTime(item.time)}</p>
          </div>
          <div className="choseOne">
            <p className="okWheat" onClick={this.handleIntheWheatFn.bind(this, item, true)}>
              <span className="wheatText">{applyForWheatLan.pass}</span>
            </p>
            <p className="cancelWheat" onClick={this.handleIntheWheatFn.bind(this, item, false)}>
              <span className="wheatText">{applyForWheatLan.rej}</span>
            </p>
          </div>
        </div>
      );
    };

    return (
      <div className="OnWheat" style={{ display: isShow ? 'block' : 'none' }}>
        {isShow ? (
          <>
            <div className="onWheatBtn">
              <p onClick={this.handleIsAllowUpperwheat.bind(this)}>{isAllow ? applyForWheatLan.BanWheat : applyForWheatLan.alloWheat}</p>
              <span>{!isAllow ? applyForWheatLan.startText : applyForWheatLan.closeText}</span>
              {/* <p onClick={this.handleAllnoUpperwheat.bind(this)}>{applyForWheatLan.ignore}</p> */}
            </div>
            {isMaxNum && <div className="maxWrong"> {applyForWheatLan.maxNumFull}</div>}

            <div className="onWheatList" style={{ height: '100%', width: '100%' }}>
              <AutoSizer>
                {({ height, width }) => (
                  <List className="onwheat_box" height={height} itemCount={onWheatList.length} itemSize={50} width={width}>
                    {Row}
                  </List>
                )}
              </AutoSizer>
            </div>
          </>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isClassBegin: state.classroom.isClassBegin,
  roomStatus: state.classroom.roomStatus,
  isVideoLayout: state.classroom.isVideoLayout,
  videoDragInfo: state.video.videoDragInfo,
  studentStreamList: state.video.studentStreamList,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(OnWheat);
