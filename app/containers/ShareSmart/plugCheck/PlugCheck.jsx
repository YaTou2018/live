/**
 * @description 插件检测
 * @author chenxx
 * @date 2019/1/7
 */
import React from 'react';
import './static/sass/plugCheck.scss';
import { connect } from 'react-redux';
import { YsGlobal } from '@global/handleGlobal';
import Actions from '@global/actions';

const { plugCheck } = YsGlobal.languageInfo.shareDeskTop;
class PlugCheck extends React.Component {
  render() {
    const { setModuleStatus, show } = this.props;
    return (
      <div className="plug_check_model" style={{ display: show === 'show' ? 'flex' : 'none' }}>
        <div className="plug_check_container  plug_check_container_english">
          <div
            className="plug_check_close"
            onClick={() => {
              setModuleStatus('share', 'hide');
            }}
          />
          <div className="plug_check_title">
            <div className="plug_check_title_icon" />
            <div className="plug_check_title_h">
              <div className="plug_check_title_h1">{plugCheck.title}</div>

              <div className="plug_check_title_h2">{plugCheck.explain}</div>
            </div>
          </div>
          <div className="plug_check_content plug_check_content_english">
            <div className="plug_check_type_true">
              {plugCheck.chromeTrue}
              <span className="plug_check_fenge">|</span>
              <span className="plug_check_click">
                {plugCheck.chromeTrueClick}
                <a href="https://chrome.google.com/webstore/detail/roadofcloud-extension/agcgobldlhnlocjpmefnpapnadkmpefa" target="_blank">
                  {plugCheck.addPlugin}
                </a>
              </span>
            </div>

            <a
              className="plug_check_icon"
              href="https://chrome.google.com/webstore/detail/roadofcloud-extension/agcgobldlhnlocjpmefnpapnadkmpefa"
              target="_blank"
            >
              <div className={`plug_check_chrome ${YsGlobal.languageName !== 'chinese' ? 'plug_check_chrome_english' : ''}`} />
            </a>
            <div className="plug_check_type_true">
              {plugCheck.chromeFalse}
              <span className="plug_check_fenge">|</span>
              <span className="plug_check_click">
                {plugCheck.chromeTrueClick}
                <a href={`${window.WBGlobal.nowUseDocAddress}/Updatefiles/Roadof-Cloud-Extension_v1.0.3.zip`} target="_blank">
                  {plugCheck.addPlugin}
                </a>
              </span>
            </div>

            <div className="plug_check_type_false  plug_check_type_false_english">
              <div className="plug_check_direct">{plugCheck.one}</div>
              <div className="plug_check_developer plug_check_developer_english" />
            </div>

            <div className="plug_check_type_false2  plug_check_type_false2_english">
              <div className="plug_check_direct">{plugCheck.two}</div>
              <div className="plug_check_success" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  show: state.Modules.deskTopSharing.shareState,
});

const mapDispatchToProps = dispatch => {
  return {
    setModuleStatus: (type, status) => {
      dispatch(Actions.setModuleStatus(type, status));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlugCheck);
