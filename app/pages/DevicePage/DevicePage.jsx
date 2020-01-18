import React, { useState, useCallback } from 'react';
import DetectionDevice from '@containers/Device/DetectionDevice';
import WelcomeDetectionDeviceSmart from '@containers/welcomeDetectionDevice/welcomeDetectionDevice';

const DevicePage = props => {
  const { joinRoom } = props;
  const [startDevice, setStartDevice] = useState(false);

  const startDetectionOnClick = useCallback(() => {
    setStartDevice(true);
  }, []);
  return (
    <React.Fragment>
      <WelcomeDetectionDeviceSmart startDetectionOnClick={startDetectionOnClick} show={!startDevice} />
      {startDevice && <DetectionDevice joinRoom={joinRoom} />}
    </React.Fragment>
  );
};
export default React.memo(DevicePage);
