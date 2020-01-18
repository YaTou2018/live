/**
 * @description 助教点击设备图标弹框
 */

import React from 'react';
import { YsGlobal } from '@global/handleGlobal';
import Signalling from '@global/services/SignallingService';

const UserExtendList = props => {
  const { mouseLeave, user, handlerUserAreaSelection, handlerUseCndLine } = props;
  const { userListInner } = YsGlobal.languageInfo;
  // 强制刷新
  const handlerUserRefresh = () => {
    Signalling.sendSignallingFromRemoteControl(user.id);
  };
  // 设备管理
  const handlerUserDeviceManagement = () => {
    Signalling.sendSignallingGetRemoteControlDevice(user.id);
  };
  return (
    <div className="user-remote-list-container" onMouseLeave={mouseLeave}>
      <span className="triangle"></span>
      <span className="add-nowrap" style={{ width: '100%' }} title={userListInner.remoteControl.refresh} onClick={handlerUserRefresh}>
        {userListInner.remoteControl.refresh}
      </span>
      <span className="add-nowrap" style={{ width: '100%' }} title={userListInner.remoteControl.deviceManagement} onClick={handlerUserDeviceManagement}>
        {userListInner.remoteControl.deviceManagement}
      </span>
      <span className="add-nowrap" style={{ width: '100%' }} title={userListInner.remoteControl.optimalServer} onClick={() => handlerUserAreaSelection(user)}>
        {userListInner.remoteControl.optimalServer}
      </span>
      <span className="add-nowrap" style={{ width: '90%' }} title={userListInner.remoteControl.getDocAddress} onClick={() => handlerUseCndLine(user)}>
        {userListInner.remoteControl.getDocAddress}
      </span>
    </div>
  );
};
export default UserExtendList;
