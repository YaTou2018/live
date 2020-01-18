import React from 'react';
import './gift.scss';

const Gift = props => {
  const { giftnumber } = props;

  return (
    <div className="gift-number">
      <span className="multiply">x</span>
      {giftnumber}
    </div>
  );
};

export default Gift;
