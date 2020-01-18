/* eslint-disable react/button-has-type */
/**
 * @description 点名
 * @author chenxx
 * @date 2019/5/28
 */

import React from 'react';
import { liveRoom } from '@global/roomConstants';
import { connect } from 'react-redux';
import Actions from '@global/actions';
import lang from './language';
import CallRollService from './CallRollService';

import CallRollList from './callRollList';
import './static/index.scss';

import SingIn from '../signIn';

const service = new CallRollService();

class CallRoll extends React.Component {
  user = liveRoom.getMySelf();

  onChangeTime(e) {
    this.props.setModuleData({
      timeLenIndex: Number(e.target.value),
    });
  }

  onClickCallRoll() {
    const { callRollState } = this.props;
    if (callRollState === 'call') {
      service.startCallRoll();
    } else {
      service.stopCallRoll();
    }
  }

  // 点击关闭按钮结束点名并关闭
  async closeCallRoll() {
    await service.stopCallRoll();
    service.close();
  }

  render() {
    const { id, callRollState, callRollData } = this.props;
    const { timeLenIndex, callRollList } = JSON.parse(callRollData);

    return [0, 1].includes(this.user.role) ? (
      <div id={id} className="call-roll">
        <div className="panel-title">
          <span>{lang.callroll}</span>
          <i className="icon icon-del" onClick={this.closeCallRoll.bind(this)} />
        </div>
        <div className="panel-body">
          <div>{lang.setType}</div>
          {callRollState === 'call' && (
            <div>
              <div className="selectbtn_sanjiao"></div>
              <select name="" id="" onChange={this.onChangeTime.bind(this)}>
                <option className="oneSlect" value="0">{lang.timerType0}</option>
                <option value="1">{lang.timerType1}</option>
                <option value="2">{lang.timerType2}</option>
                <option value="3">{lang.timerType3}</option>
                <option value="4">{lang.timerType4}</option>
              </select>
            </div>
          )}
          {callRollState === 'calling' && <div className="choose-time">{lang[`timerType${timeLenIndex}`]}</div>}
          <button className={`button ${callRollState === 'call' ? 'button-call-rolling ' : ''}`} onClick={this.onClickCallRoll.bind(this)}>
            {lang[callRollState === 'call' ? 'startRollCall' : 'endRollCall']}
          </button>
          <CallRollList callRollList={callRollList} />
        </div>
      </div>
    ) : (
      <SingIn />
    );
  }
}

const mapStateToProps = ({ Modules }) => ({
  callRollState: Modules.callRoll.callRollState,
  callRollData: JSON.stringify(Modules.callRoll.callRollData),
});

const mapDispatchToProps = () => ({
  setModuleStatus: status => {
    Actions.setModuleStatus('callRoll', status);
  },
  setModuleData: data => {
    Actions.setModuleData('callRoll', data);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CallRoll);
