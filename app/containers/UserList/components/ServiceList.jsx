/**
 * @description 用户list
 */

import React from 'react';
import { YsGlobal } from '@global/handleGlobal';
const { userListInner } = YsGlobal.languageInfo;
const Serverlist = props => {
  const { serverList, closeOptimalServer, selectServer, selected, onOk } = props;
  return (
    <div className="device-control">
      <div className="control-header">
        <span className="text">{userListInner.remoteControl.optimalServer}</span>
        <i className="icon icon-del" onClick={closeOptimalServer} />
      </div>
      <div className="device-ops-wrapper">
        <span className="ops-tip">{userListInner.networkExtend.title.text}</span>
        <ul className="ops-list">
          {serverList.map(item => (
            <li key={item.serverareaname} onClick={() => selectServer(item.serverareaname)} className={item.serverareaname === selected ? 'active' : ''}>
              <span className="icon" />
              <span className="name">{item.chinesedesc}</span>
            </li>
          ))}
        </ul>
        {/* 确认按钮 */}
        <button className="device-result-btn" onClick={onOk}>
          {userListInner.networkExtend.title.sure}
        </button>
      </div>
    </div>
  );
};
export default Serverlist;
