// 系统信息设置
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { YsGlobal } from '../../../global/handleGlobal';
import { myself } from '@utils/';
const { deviceTest } = YsGlobal.languageInfo;
const { systemInner } = deviceTest;

class SystemSetting extends Component {
  render() {
    const { currentUser, operatingSystem, LoginDevice, browser, versionNumber } = this.props.systemInfo;
    return (
      <div style={{ display: this.props.show ? 'block' : 'none' }}>
        <ul className="systemInfo_box">
          <li>
            <span className="name">{systemInner.present}</span>
            <span className="value">{currentUser}</span>
          </li>
          <li>
            <span className="name">{systemInner.equi}</span>
            <span className="value">{LoginDevice}</span>
          </li>
          <li>
            <span className="name">{systemInner.operation}</span>
            <span className="value">{operatingSystem}</span>
          </li>
          <li>
            <span className="name">{systemInner.mediaServer}</span>
            <span className="value">{myself().servername}</span>
          </li>
          <li>
            <span className="name">{systemInner.docAddress}</span>
            <span className="value">{YsGlobal.roomInfo.docHost}</span>
          </li>
          {/* <li>
            <span className="name">{systemInner.ip}</span>
            <span className="value">{IPAddress}</span>
          </li>
          <li>
            <span className="name">{systemInner.throw}</span>
            <span className="value">{this.props.packetsLostNet || 0}%</span>
          </li> */}
          <li>
            <span className="name">{systemInner.brow}</span>
            <span className="value">{browser}</span>
          </li>
          {/* <li>
            <span className="name">{systemInner.roomid}</span>
            <span className="value">{roomNumber}</span>
          </li> */}
          <li>
            <span className="name">{systemInner.versionid}</span>
            <span className="value">{versionNumber}</span>
          </li>
          {/* <li>
                <span className='name'>语言选择：</span>
                <span className='value'>
                    <label className='radio_box'>
                        <i className={"icon " + ('icon-gouxuan')} />
                        <input type="radio" name="language" value='简体中文' />简体中文
                    </label>
                    <label className='radio_box'>
                        <i className={"icon " + ('icon-weigouxuan')} />
                        <input type="radio" name="language" value='繁体中文' />繁体中文
                    </label>
                    <label className='radio_box'>
                        <i className={"icon " + ('icon-weigouxuan')} />
                        <input type="radio" name="language" value='英语' />英语
                    </label>
                </span>
            </li>                     */}
        </ul>

        <div className="footer_btn">
          <button type="button" className="btn btn-can" onClick={() => this.props.okButtonOnClick(4)}>
            {systemInner.sure}
          </button>
        </div>
      </div>
    );
  }
}

SystemSetting.propTypes = {
  // 确定按钮
  okButtonOnClick: PropTypes.func,
  // 系统信息
  systemInfo: PropTypes.object,

  show: PropTypes.bool,
  // packetsLostNet: PropTypes.number,
};

export default SystemSetting;
