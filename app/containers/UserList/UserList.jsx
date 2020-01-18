/**
 * @description 花名册
 */

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { YS, liveRoom, EVENT_TYPE } from '@global/roomConstants';
import FetchService from '@global/services/FetchService';
import WhiteboardService from '@global/services/WhiteboardService';
import DeviceService from '@global/services/DeviceService';
import Signalling from '@global/services/SignallingService';
import { YsGlobal } from '@global/handleGlobal';
import Pagitation from './components/Pagitation';
import Serverlist from './components/ServiceList';
import DocAddress from './components/DocAddress';
import DeviceManagement from './components/DeviceManagement';
import { setUserProperty } from '../../utils';
import './static/Sass/index.scss';

import NameList from './NameList';

let timerInter = null;
const { userListInner } = YsGlobal.languageInfo;
const { navBarInner } = YsGlobal.languageInfo.pagesText;
const pigeSize = 10;

const UserListSmart = props => {
  const { show, userListData } = props;
  const { isLiveRoom } = YsGlobal.roomInfo;
  const [list, setList] = useState([]);
  const [pageSum, setPageSum] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchVal, setSearchVal] = useState('');
  const [serverList, setServerList] = useState([]); // 服务器列表
  const [showServerlist, setShowServerlist] = useState(false); // 是否显示优选网络
  const [selected, setSelected] = useState(''); // 选中的serviceName
  const [docs, setDocs] = useState([]); // 课件服务器列表
  const [showDocAddress, setShowDocAddress] = useState(false); // 是否显示可嘉你服务器
  const [address, setAddress] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [devicesData, setDevicesData] = useState({});
  const [showDeviceManagement, setShowDeviceManagement] = useState(false);

  useEffect(() => {
    const listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    // 监听remoteController
    liveRoom.addEventListener(
      EVENT_TYPE.roomPubmsg,
      param => {
        const pubmsgData = param.message;
        switch (pubmsgData.name) {
          case 'RemoteControl':
            window.location.reload();
            break;
          case 'UserAreaSelection':
            liveRoom.switchServer(pubmsgData.data.selected);
            break;
          case 'UseCndLine':
            WhiteboardService.getYsWhiteBoardManager().switchDocAddress(pubmsgData.data.address);
            break;
          case 'getRemoteControlDevice':
            YS.DeviceMgr.getDevices(devicesInfo => {
              Signalling.sendSignallingRemoteControlDeviceManagement(pubmsgData.fromID, devicesInfo);
            });
            break;
          case 'remoteControlDeviceManagement':
            setDevicesData(pubmsgData.data);
            setShowDeviceManagement(true);
            setShowServerlist(false);
            setShowDocAddress(false);
            setCurrentUser(pubmsgData.fromID);
            break;
          case 'setRemoteControlDevice':
            DeviceService.setDevices({ selectDeviceInfo: pubmsgData.data.deviceIdMap });
            if (YS.DeviceMgr && YS.DeviceMgr.setSpeakerTestVolume) {
              YS.DeviceMgr.setSpeakerTestVolume(pubmsgData.data.audiooutputVolume);
            }
            break;
          default:
            break;
        }
      },
      listernerBackupid,
    );
    return () => {
      liveRoom.removeBackupListerner(listernerBackupid);
    };
  }, []);

  useEffect(() => {
    if (show) {
      if (isLiveRoom) {
        liveRoom.getRoomUsers(
          (users, total) => {
            const roomUers = users; // 所有用户
            setList(roomUers);
            setPageSum(Math.ceil(total / pigeSize, 10));
          },
          (currentPage - 1) * pigeSize,
          pigeSize,
          [2],
        );
        timerInter = setInterval(() => {
          liveRoom.getRoomUsers(
            (users, total) => {
              const roomUers = users; // 所有用户
              setList(roomUers);
              setPageSum(Math.ceil(total / pigeSize, 10));
            },
            (currentPage - 1) * pigeSize,
            pigeSize,
            [2],
          );
        }, 2000);
      } else {
        clearInterval(timerInter);
        const searchList = userListData.filter(item => item.nickname.includes(searchVal)).filter(it => it.role !== 88);
        setList(searchList);
        setPageSum(1);
      }
    }
    return () => {
      clearInterval(timerInter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, userListData, show, searchVal]);

  // 关闭花名册以后，课件服务器和设备管理都消失
  useEffect(() => {
    if (!show) {
      setShowServerlist(false);
      setShowDocAddress(false);
      setShowDeviceManagement(false);
    }
  }, [show]);
  // 翻页
  const changPage = num => {
    clearInterval(timerInter);
    if (show) {
      if (isLiveRoom) {
        liveRoom.getRoomUsers(
          users => {
            const roomUers = users; // 所有用户
            setList(roomUers);
            setCurrentPage(num);
          },
          (currentPage - 1) * pigeSize,
          pigeSize,
          [2],
        );
      } else {
        const searchList = userListData.filter(item => item.nickname.includes(searchVal));
        setList(searchList.slice((num - 1) * pigeSize, (num - 1) * pigeSize + pigeSize));
        setCurrentPage(num);
      }
    }
  };

  // 搜索
  const search = val => {
    const searchList = userListData.filter(item => item.nickname.includes(val));
    setList(searchList);
    setPageSum(1);
    setCurrentPage(1);
    setSearchVal(val);
  };
  // 优选网络
  const handlerUserAreaSelection = async user => {
    setCurrentUser(user);
    FetchService.getServiceList(user, _list => {
      const serverarealist = [];
      for (const value of Object.values(_list)) {
        serverarealist.push(value);
      }
      setServerList(serverarealist);
      setShowServerlist(true);
      setShowDocAddress(false);
      setShowDeviceManagement(false);
      setSelected(user.servername);
    });
  };

  // 关闭优选网络
  const closeOptimalServer = () => {
    setShowServerlist(false);
  };

  const selectServer = serverareaname => {
    setSelected(serverareaname);
  };

  // 确定按钮切换网络
  const onOk = () => {
    setUserProperty(currentUser.id, { servername: selected });
    Signalling.sendSignallingUserAreaSelection(currentUser.id, { selected });
    setShowServerlist(false);
  };

  // 课件服务器
  const handlerUseCndLine = async user => {
    setCurrentUser(user);
    const res = await FetchService.getAllCndIp();
    setDocs(res);
    setShowDocAddress(true);
    setShowServerlist(false);
    setShowDeviceManagement(false);
  };

  // 确定按钮切换cdn
  const onOkAddress = () => {
    if (!address) return;
    Signalling.sendSignallingUseCndLine(currentUser.id, { address });
    setShowDocAddress(false);
  };
  return (
    <div className="userlist-container" onClick={e => e.stopPropagation()} style={{ width: !isLiveRoom ? '610px' : '360px' }}>
      <span className="triangle"></span>
      <span className="userlist-title">
        {' '}
        {isLiveRoom ? navBarInner.userList : userListInner.roster}
        {/* {false && isClassRoom && myself().role === 1 && <UserListSearch search={search} />} */}
      </span>
      {showServerlist && (
        <Serverlist serverList={serverList} closeOptimalServer={closeOptimalServer} selected={selected} selectServer={selectServer} onOk={onOk} />
      )}
      {showDocAddress && (
        <DocAddress
          docs={docs}
          selectAddress={domain => {
            setAddress(domain);
          }}
          address={address}
          onOk={onOkAddress}
          closeAddress={() => {
            setShowDocAddress(false);
          }}
        />
      )}
      {showDeviceManagement && (
        <DeviceManagement
          devicesData={devicesData}
          closeDevices={() => {
            setShowDeviceManagement(false);
          }}
          onOk={deviceIdMap => {
            Signalling.sendSignallingSetRemoteControlDevice(currentUser, deviceIdMap);
            setShowDeviceManagement(false);
          }}
        />
      )}
      <NameList userListData={list} handlerUserAreaSelection={handlerUserAreaSelection} handlerUseCndLine={handlerUseCndLine} />
      {isLiveRoom && <Pagitation pageSum={pageSum} currentPage={currentPage} changPage={changPage} />}
    </div>
  );
};

// 需要渲染什么数据
function mapStateToProps({ user }) {
  return {
    userListData: user.userList,
  };
}

// 连接组件
export default connect(mapStateToProps)(UserListSmart);
