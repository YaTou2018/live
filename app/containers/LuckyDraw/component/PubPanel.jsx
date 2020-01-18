import React, { Component } from 'react';
import Toast from '@components/Toast';
import '../styles/PubPanel.scss';
import { YsGlobal } from '@global/handleGlobal';
import Actions from '@global/actions';
import { liveRoom, EVENT_TYPE } from '@global/roomConstants';
import Signalling from '../../../global/services/SignallingService';
const { lucky } = YsGlobal.languageInfo;
const { pubPanelInner } = lucky;

export default class PubPanel extends Component {
  componentDidMount() {
    liveRoom.addEventListener(EVENT_TYPE.roomPubmsg, param => {
      const pubmsgData = param.message;
      switch (pubmsgData.name) {
        case 'LiveLuckDrawConfig': {
          const { winners, isReLotterydraw, luckdrawNum } = pubmsgData.data;
          Actions.setModuleData('luckyDraw', {
            winners: winners.map(({ name, time, id }) => ({
              name,
              time,
              id,
            })),
            luckdrawNum,
            isReLotterydraw,
          });
          break;
        }
        default:
          break;
      }
    });
  }

  getTimeNow() {
    const curDate = new Date();
    return `${curDate.getMonth() + 1}-${curDate.getDate()} ${curDate.getHours()}:${curDate.getMinutes()}`;
  }

  numBtnClick(step) {
    let num = Math.max(0, this.props.luckdrawNum + step);
    num = Math.min(num, this.props.onlineStudentNum);
    this.numChange(num);
  }

  numChange(newNum) {
    const { winners, luckyState, isReLotterydraw } = this.props;
    if (luckyState !== 'ready') return;
    const postData = {
      winners: winners.map(({ name, time, id }) => ({
        name,
        time,
        id,
      })),
      luckdrawNum: newNum,
      isReLotterydraw,
    };
    Actions.setModuleData('luckyDraw', postData);
    Signalling.sendSignallingToLiveLuckDrawConfig(postData);
  }

  handleChange(e) {
    this.numChange(e.target.value);
  }

  start() {
    const { pub, isReLotterydraw, luckdrawNum } = this.props;
    if (!luckdrawNum) {
      Toast.error(pubPanelInner.noWinnersWarnMsg);
      return;
    }
    if (luckdrawNum > this.props.onlineStudentNum) {
      Toast.error(pubPanelInner.onlinePassWinners);
      return;
    }
    const excloudWinners = Boolean(isReLotterydraw !== 1);
    if (typeof pub === 'function') {
      const { winners } = this.props;
      Actions.setModuleData('luckyDraw', {
        winners: winners.map(({ name, time, id }) => ({
          name,
          time,
          id,
        })),
        luckdrawNum,
        isReLotterydraw,
      });
      pub(luckdrawNum, excloudWinners);
    }
  }

  excloudWinners() {
    const { winners, luckyState, luckdrawNum, isReLotterydraw } = this.props;
    if (luckyState !== 'ready') return;
    const postData = {
      winners: winners.map(({ name, time, id }) => ({
        name,
        time,
        id,
      })),
      luckdrawNum,
      isReLotterydraw: isReLotterydraw ? 0 : 1,
    };
    Actions.setModuleData('luckyDraw', postData);
    Signalling.sendSignallingToLiveLuckDrawConfig(postData);
  }

  render() {
    const { winners, countdownNum, luckyState, luckdrawNum = 1, isReLotterydraw = 1 } = this.props;
    const hasWinner = winners instanceof Array && winners.length > 0;
    const btnText = luckyState === 'ready' ? pubPanelInner.start : pubPanelInner.end;

    return (
      <div className="lucky-pub-panel">
        {countdownNum < 0 && hasWinner && <div className="connect-line"></div>}
        <div className="lucky-draw-ctrl">
          {/* <div className="lucky-draw-tit">{pubPanelInner.luckyBig}</div> */}
          <div className="ctrl-panel">
            <div className="ctrl-desc">{pubPanelInner.setLuckNum}</div>
            <div className="ctrl-num">
              <span className="sub-btn" onClick={() => this.numBtnClick(-1)}>
                -
              </span>
              <input type="number" className="num-input" value={luckdrawNum} onChange={this.handleChange.bind(this)} />
              <span className="add-btn" onClick={() => this.numBtnClick(1)}>
                +
              </span>
            </div>
          </div>
          <div className="winning-btn" onClick={() => this.start()}>
            {countdownNum >= 0 ? countdownNum : btnText}
          </div>
          <div className="excloud-winning" onClick={() => this.excloudWinners()}>
            <div className={`isSelect  ${+isReLotterydraw !== 1 ? 'selected' : ''}`} />
            {pubPanelInner.exclude}
          </div>
        </div>
        {countdownNum < 0 && hasWinner && (
          <div className="panel_connect">
            <div />
            <div />
          </div>
        )}
        {countdownNum < 0 && hasWinner && (
          <div className="winning-panel">
            {/* <div className="winning-tit"> {pubPanelInner.luckName}</div> */}
            <div className="winning-list">
              {winners.map(({ name, id }) => (
                <div className="winning-item" key={`winning_${id}_${new Date().valueOf().toString}`}>
                  <span className="winning-name">{name}</span>
                  <span className="winning-time">{this.getTimeNow()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}
