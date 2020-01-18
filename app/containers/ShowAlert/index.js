import React from 'react';
import ShowAlert from './ShowAlert';

class MobileLxNotification extends React.Component {
  render() {
    return (
      <div className="modal-wrapper-mobile">
        <ShowAlert />
      </div>
    );
  }
}

export { MobileLxNotification };
export default ShowAlert;
