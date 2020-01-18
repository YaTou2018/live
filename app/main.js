import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import DeviceService from '@global/services/DeviceService';
import { YsGlobal } from '@global/handleGlobal';
// import FontFaceObserver from 'fontfaceobserver';

import App from './pages/app';
import store from './store';
import 'styles/theme.scss';
import 'utils/Log';

const MOUNT_NODE = document.getElementById('app');
if (YsGlobal.playback || YsGlobal.isMobile || (!YsGlobal.isCheckAudioOutput && !YsGlobal.isCheckVideoDevice)) {
  ReactDOM.render(
    <Provider store={store}>
      <App needDetection={false} />
    </Provider>,
    MOUNT_NODE,
  );
} else {
  DeviceService.checkNeedDetectionDevice(needDetection => {
    ReactDOM.render(
      <Provider store={store}>
        <App needDetection={needDetection} />
      </Provider>,
      MOUNT_NODE,
    );
  });
}
