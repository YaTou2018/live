/**
 * @description 签到列表
 * @author chenxx
 * @date 2019/5/29
 */

import React from 'react';
import lang from './language';
import { YsGlobal } from '../../../global/handleGlobal';

const { callRollCom } = YsGlobal.languageInfo;

export default class CallRollList extends React.Component {
  render() {
    const { callRollList } = this.props;
    return (
      <ul className="callroll-list">
        {callRollList.reverse().map(item => (
          <li className="card-item" key={item.id}>
            <div className="card-item-line1">
              {item.time}
              <span className={item.status === 'PUB' ? 'status-pub' : 'status-finish'}>{item.status === 'PUB' ? lang.state0 : lang.state1}</span>
            </div>
            <div>
              {lang.crTime}：<span className="act">{`${lang[`timerType${item.timerType}`]}`}</span>
            </div>
            <div>
              {lang.signInNum}：
              <span className="act">
                {item.signInNum}
                {callRollCom.person}
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}
