import React from 'react';
import { YsGlobal } from '@global/handleGlobal';
import './static/sass/index.scss';
const { liveMobilePage } = YsGlobal.languageInfo;
const NetworkJitter = props => {
  return (
    <div className="NetworkJitter" style={{ height: props.show ? '100%' : '0' }}>
      <div className="reconnect"></div>
      {liveMobilePage.disconnectedTip}
    </div>
  );
};

export default NetworkJitter;
