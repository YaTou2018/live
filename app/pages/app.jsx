import React, { useState, useCallback, useEffect } from 'react';
// import { hot } from 'react-hot-loader';
import { YsGlobal } from '@global/handleGlobal';
import DeviceService from '@global/services/DeviceService';
import { getStorage } from '@utils/ysUtils';
import Actions from '@global/actions';
import { DndProvider } from 'react-dnd';
import HTMLBackend from 'react-dnd-html5-backend';
import './app.scss';

import LivePage from './LivePage/LivePage';
import DevicePage from './DevicePage/DevicePage';
import MobilePage from './MobilePage/MobilePage';
import UpdateElectronPage from './UpdateElectronPage/UpdateElectronPage';

const App = props => {
  const [needDetection, setNeedDetection] = useState(props.needDetection);

  useEffect(() => {
    let isPageHide = false;
    window.addEventListener('pageshow', () => {
      if (isPageHide) {
        window.location.reload();
      }
    });
    window.addEventListener('pagehide', () => {
      isPageHide = true;
    });
  }, []);
  useEffect(() => {
    Actions.toggleVideoMirror(JSON.parse(getStorage('isVideoMirror')));
    DeviceService.getDevicesList();
    DeviceService.deviceChangeListener(); // 监听设备改变
  }, []);

  const joinRoom = useCallback(() => {
    setNeedDetection(false);
  }, []);
  return (
    <DndProvider backend={HTMLBackend}>
      <UpdateElectronPage />
      {needDetection && <DevicePage joinRoom={joinRoom} />}
      {!YsGlobal.isMobile && !needDetection && <LivePage />}
      {YsGlobal.isMobile && <MobilePage />}
    </DndProvider>
  );
};

export default App;
