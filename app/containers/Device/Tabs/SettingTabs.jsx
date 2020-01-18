// 房间里的设备设置tabs
import React from 'react';
import PropTypes from 'prop-types';
import { getTabsData } from './control';

import '../static/sass/tab.scss';

function SettingTabs(props) {
  const { selectKey } = props;
  const { tabsSwitchFn } = props;
  const tabsList = getTabsData('setting', 'videoinput');
  return (
    <div className="setting_tabs_warp">
      {tabsList.map((item, index) => (
        <div
          key={item.key}
          className={`tabs-item ${selectKey === item.key ? 'on' : ''}`}
          onClick={() => {
            tabsSwitchFn(index, item.key);
          }}
        >
          {selectKey === item.key ? <span className="dian">·</span> : null}
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
}

SettingTabs.propTypes = {
  // 当前选择的第几个
  selectKey: PropTypes.string,
  // 切换tab的方法
  tabsSwitchFn: PropTypes.func,
};

export default SettingTabs;
