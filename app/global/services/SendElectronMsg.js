import { L } from '@global/roomConstants';

let electronObj;
if (navigator.userAgent.indexOf('Electron') > -1) {
  try {
    if (typeof window.require !== 'undefined') {
      electronObj = window.require('electron') || {};
    }
  } catch (e) {
    console.error('this electron version is too low, not supported desktopCapturer.');
  }
}

class SendElectronMsg {
  send(action) {
    if (!electronObj || !electronObj.ipcRenderer) {
      L.Logger.error('The ipcRenderer method could not be found');
      return;
    }
    electronObj.ipcRenderer.sendSync(action);
  }

  showDesktopMask() {
    this.send('show-desktopMark');
  }

  hideDesktopMask() {
    this.send('hide-desktopMark');
  }
}

export default new SendElectronMsg();
