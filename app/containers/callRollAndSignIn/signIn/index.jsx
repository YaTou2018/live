/* eslint-disable react/button-has-type */
/**
 * @description 签到
 * @author chenxx
 * @date 2019/5/29
 */

import React from 'react';

import { connect } from 'react-redux';
import { liveRoom } from '@global/roomConstants';
import Actions from '@global/actions';
import FetchService from '@global/services/FetchService';
import utils from '../utils';
import { YsGlobal } from '../../../global/handleGlobal';
import Signalling from '../../../global/services/SignallingService';

import './static/index.scss';

const { callRollCom } = YsGlobal.languageInfo;

class SignIn extends React.Component {
  state = {
    currentTime: 0,
    btnInner: callRollCom.signIn,
  };

  timerID = undefined;

  timerOut = undefined;

  constructor(props) {
    super(props);
    const { timeRemaining } = JSON.parse(props.callRollData);
    this.state.currentTime = timeRemaining;
    // 计时器
    this.timerID = setInterval(() => {
      const { currentTime } = this.state;
      if (currentTime <= 0) {
        props.setModuleStatus('');
        clearInterval(this.timerID);
      } else {
        this.setState({ currentTime: currentTime - 1000 });
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  /** 学生签到接口 */
  onSignIn() {
    const that = this;
    const { id: userId, nickname } = liveRoom.getMySelf();
    const { currentCRID } = JSON.parse(this.props.callRollData);
    const ajaxData = {
      serial: YsGlobal.roomInfo.serial,
      userId,
      nickname,
      callrollid: currentCRID, // 当前点名ID
    };
    FetchService.onSignIn(ajaxData).then(res => {
      if (Number(res.result) === 0) {
        this.setState({
          btnInner: callRollCom.SignInSuccessfully,
        });

        that.timerOut = setTimeout(() => {
          that.close();
          // 签到信令
          Signalling.sendSignallingToStudentSingin(false, userId, `qiandao_${userId}`, {
            studentId: userId,
          });
          clearTimeout(that.timerOut);
        }, 1000);
      }
    });
  }

  close() {
    this.props.setModuleStatus('');
  }

  render() {
    const { id } = this.props;
    const { currentTime, btnInner } = this.state;
    const showTime = utils.ms2minute(currentTime);
    return (
      <div className="sign-in" id={id}>
        <div className="top_option1"></div>
        <div className="top_option2"></div>
        <div className="timer">
          <div>
            <div>00</div>
          </div>
          <span>:</span>
          <div>
            <div>{showTime.minutes}</div>
          </div>
          <span>:</span>
          <div>
            <div>{showTime.seconds}</div>
          </div>
        </div>
        <button className="button" onClick={this.onSignIn.bind(this)}>
          {btnInner}
        </button>
        {/* <div className="signMask"></div> */}
      </div>
    );
  }
}

const mapStateToProps = ({ Modules }) => ({
  callRollState: Modules.callRoll.callRollState,
  callRollData: JSON.stringify(Modules.callRoll.callRollData),
});

const mapDispatchToProps = dispatch => ({
  setModuleStatus: status => {
    Actions.setModuleStatus('callRoll', status);
  },
  setModuleData: data => {
    dispatch(Actions.setModuleData('callRoll', data));
  },
});

const RealSignIn = connect(mapStateToProps, mapDispatchToProps)(SignIn);

export default RealSignIn;

class RealMobileSignIn extends React.Component {
  render() {
    return (
      <div className="sign-in-mobile">
        {this.props.callRollState === 'signin' && (
          <div className="signMask">
            <RealSignIn {...this.props} />
          </div>
        )}
      </div>
    );
  }
}

const MobileSignIn = connect(mapStateToProps)(RealMobileSignIn);

export { MobileSignIn };
