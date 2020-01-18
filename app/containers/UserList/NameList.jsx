/**
 * @description 用户list
 */

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { YsGlobal } from '@global/handleGlobal';
import { myself } from '@utils/';
import utils from './utils';
import UserItemIcon from './components/UserItemIcon';
import UserExtendList from './components/UserExtendList';
const NameList = props => {
  const { userListData, handlerUserAreaSelection, handlerUseCndLine, isClassBegin } = props;
  const { role } = myself();
  const [showUserExtendList, setShowUserExtendList] = useState('');
  const [showTips, setShowTips] = useState('');
  // const showUserItemIcon = myself().role === 1;
  const { isLiveRoom } = YsGlobal.roomInfo;
  const { courseList } = YsGlobal.languageInfo;
  const { serviceInner } = courseList;
  const assistantManage = userId => {
    if (role !== 1) {
      return;
    }
    setShowUserExtendList(userId);
  };
  return (
    <ul className="list-box">
      {userListData.map(user => {
        const deviceTypeClassName = utils.deviceTypeClassNameInfo(user.devicetype);
        return (
          <li key={`user_${user.id}`} style={{ display: (role === 0 && user.role === 0) || user.role === 4 ? 'none' : 'flex' }}>
            {showTips === user.id && <div className="tips">{serviceInner.maxMumberPeople}</div>}
            <div className={`ys-icon-before ${deviceTypeClassName}`} onClick={() => assistantManage(user.id)}>
              {showUserExtendList === user.id && user.role !== 1 && (
                <UserExtendList
                  user={user}
                  handlerUserAreaSelection={handlerUserAreaSelection}
                  handlerUseCndLine={handlerUseCndLine}
                  mouseLeave={() => {
                    setShowUserExtendList('');
                  }}
                />
              )}
            </div>
            <span title={user.nickname} className="user-list-item-name">
              {user.nickname}
            </span>
            {!isLiveRoom && <UserItemIcon user={user} setShowTips={userId => setShowTips(userId)} isClassBegin={isClassBegin} />}
          </li>
        );
      })}
    </ul>
  );
};

const mapStateToProps = ({ classroom }) => {
  return {
    isClassBegin: classroom.isClassBegin,
  };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NameList);
