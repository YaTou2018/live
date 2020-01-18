/**
 * @description 课件服务器
 */

import React from 'react';
import { YsGlobal } from '@global/handleGlobal';
const { userListInner } = YsGlobal.languageInfo;
const DocAddress = props => {
  const { docs, selectAddress, address, onOk, closeAddress } = props;
  return (
    <div className="device-control">
      <div className="control-header">
        <span className="text">{userListInner.remoteControl.getDocAddress}</span>
        <i className="icon icon-del" onClick={closeAddress} />
      </div>
      <div className="device-ops-wrapper">
        <ul className="ops-list">
          {docs.map(item => (
            <li
              key={item.domain}
              onClick={() => {
                selectAddress(item.domain);
              }}
              className={item.domain === address ? 'active' : ''}
            >
              <span className="icon" />
              <span className="name">
                {item.cninfo}({item.domain})
              </span>
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
export default DocAddress;
