// 初始进入教室时设备检测的tabs
import React from 'react';
import PropTypes from 'prop-types';
import { getTabsData } from './control';
import '../static/sass/tab.scss';

function DetectionTabs(props) {
  const tabsIndex = props.selectKey;
  const tabsList = getTabsData('detection', tabsIndex);
  const { resultsObj } = props;
  return (
    <div className="detection-tabs-warp">
      {tabsList.map(item => (
        <React.Fragment key={`${item.key}`}>
          <div className="tabs-item">
            {resultsObj[item.key] ? <img src={item.icon} alt="" /> : <img src={item.iconArr[3]} alt="" />}
            <span>{item.text}</span>
          </div>
          {item.last ? null : <span className="gang" />}
        </React.Fragment>
      ))}
    </div>
  );
}

DetectionTabs.propTypes = {
  // 当前选择的第几个
  selectKey: PropTypes.string,
  resultsObj: PropTypes.object,
};

export default DetectionTabs;
