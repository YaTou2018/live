import React, { Component } from 'react';
import { connect } from 'react-redux';

import PubPanel from './component/PubPanel';
import Winners from './component/Winners';
import LuckyService from './LuckyService';

import './styles/LuckyDraw.scss';
const service = new LuckyService();

class LuckyDraw extends Component {
  state = {
    // btnText: pubPanelInner.start,
  };

  async pub(...args) {
    const { luckyState, countdownNum } = this.props.luckyDraw;
    if (countdownNum >= 0) return;
    if (luckyState === 'ready') {
      await service.pubLuckyDraw(...args);
    } else if (luckyState === 'pub') {
      service.stopLuckyDraw();
    }
  }

  render() {
    const {
      luckyDraw: {
        luckyState,
        luckyData: { winners, luckdrawNum, isReLotterydraw, endtime },
        countdownNum,
      },
      onlineStudentNum,
    } = this.props;
    const isShowLuckDraw = ['ready', 'pub'].includes(luckyState);
    return (
      <div className="lucky-draw">
        {luckyState !== 'lottery' && <span className="close-btn" onClick={service.close} />}
        {isShowLuckDraw && (
          <PubPanel
            luckdrawNum={luckdrawNum}
            isReLotterydraw={isReLotterydraw}
            onlineStudentNum={onlineStudentNum}
            countdownNum={countdownNum}
            luckyState={luckyState}
            winners={winners}
            pub={(...args) => this.pub(...args)}
          />
        )}
        <div className="sub-panel">
          {luckyState === 'lottery' && <div className="in-lottery"></div>}
          {luckyState === 'winners' && <Winners winners={winners} endtime={endtime} />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  onlineStudentNum: state.user.onlineStudentNum,
  luckyDraw: state.Modules.luckyDraw,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LuckyDraw);
