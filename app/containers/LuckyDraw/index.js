import React from 'react';
import LuckyDraw from './LuckyDraw';

class MobileLuckyDraw extends React.Component {
  render() {
    return (
      <div className="mobile-lucky-draw">
        <LuckyDraw />
      </div>
    );
  }
}

export { MobileLuckyDraw };
export default LuckyDraw;
