/**
 * 右侧头部-时钟计时
 * @author chenxx
 */
import React from 'react';
import { liveRoom, EVENT_TYPE } from '@global/roomConstants';
import { connect } from 'react-redux';
import Actions from '@global/actions';
import Signalling from '@global/services/SignallingService';
import utils from './utils';

class ClockTimeSmart extends React.Component {
  state = {
    clockTimeToHide: false,
    clock: {
      hh: '00',
      mm: '00',
      ss: '00',
    },
    clockColor: 'no-start',
  };

  serviceTime = null;

  classBeginTime = null;

  init = true;

  timerIntervalObject = null;

  componentDidMount() {
    // 在完成首次渲染之前调用，此时仍可以修改组件的state
    this.listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    this.stopTime();
    liveRoom.addEventListener(EVENT_TYPE.roomPubmsg, this.handlerRoomPubmsg.bind(this), this.listernerBackupid);
    liveRoom.addEventListener(EVENT_TYPE.roomDelmsg, this.handlerRoomDelmsg.bind(this), this.listernerBackupid);

    if (!this.classBeginTime && this.props.classBeginTime && this.init) {
      this.init = false;
      this.classBeginTime = this.props.classBeginTime;
      this.startTime();
    }
  }

  componentWillUnmount() {
    this.stopTime();
    this.setState = () => false;
    liveRoom.removeBackupListerner(this.listernerBackupid);
  }

  handlerRoomPubmsg({ message }) {
    switch (message.name) {
      case 'ClassBegin':
        this.stopTime();
        this.resetClockTime();
        this.classBeginTime = message.ts * 1000;
        this.setState({ clockTimeToHide: false });
        this.startTime();
        Actions.beginClass(this.classBeginTime);
        break;
      case 'UpdateTime':
        this.serviceTime = message.ts * 1000;
        break;
      default:
        break;
    }
  }

  handlerRoomDelmsg({ message }) {
    if (message.name === 'ClassBegin') {
      this.classBeginTime = null;
      this.stopTime();
      this.resetClockTime();
    }
  }

  startTime() {
    this.timer = undefined;
    this.intervalNumber = 0;
    const { classBeginTime } = this;
    this.timer = setInterval(() => {
      if (classBeginTime) {
        if (this.serviceTime) {
          this.serviceTime += 1000;
          const clock = utils.getTimeDifferenceToFormat(classBeginTime, this.serviceTime);
          if (clock) {
            this.setState({ clock });
          }
        } else {
          Signalling.sendSignallingFromUpdateTime(liveRoom.getMySelf().id);
        }
        this.intervalNumber += 1;
        if (this.intervalNumber > 300) {
          Signalling.sendSignallingFromUpdateTime(liveRoom.getMySelf().id);
          this.intervalNumber = 0;
        }
      }
    }, 1000);
  }

  stopTime() {
    clearInterval(this.timer);
    this.timer = null;
    this.intervalNumber = 0;
  }

  /* 重置时间 */
  resetClockTime() {
    this.setState({
      clock: {
        hh: '00',
        mm: '00',
        ss: '00',
      },
      clockColor: 'no-start',
    });
  }

  render() {
    return (
      <div
        className={`roomNo h-time-wrap ${this.state.clockColor}`}
        id="time_container"
        style={{
          display: this.state.clockTimeToHide ? 'none' : 'inline-block',
          marginLeft: '4px',
        }}
      >
        {this.state.clock.hh}
        <span className="space user-select-none ">:</span>
        {this.state.clock.mm}
        <span className="space user-select-none ">:</span>
        {this.state.clock.ss}
      </div>
    );
  }
}

function mapStateToProps({ classroom }) {
  return {
    classBeginTime: classroom.classBeginTime,
  };
}

export default connect(mapStateToProps)(ClockTimeSmart);
