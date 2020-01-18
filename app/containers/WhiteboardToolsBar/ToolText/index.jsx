/* eslint-disable react/button-has-type */
import React from 'react';
import ColorPicker from '@components/ColorPicker/ColorPicker';
import YsSliderDumb from '@components/slider/YsSlider';
import { YsGlobal } from '@global/handleGlobal';
import { compare } from '@utils/';
const { tools } = YsGlobal.languageInfo.whiteboard;
export default class ToolText extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (compare(this.props, nextProps) || compare(this.props, nextProps)) {
      return true;
    }
    return false;
  }

  render() {
    const {
      openToolText,
      changePen,
      hideAllSelectBox,
      changeFontFamily,
      setLineColor,
      changeFontSize,
      primaryColor,
      fontFamily,
      showSelectType,
      isActive,
      fontSize,
      fontoptionsIsShow,
    } = this.props;
    return (
      <li className={`tool-option tool_text ${isActive === 'tool_text' ? 'active' : ''}`} onClick={openToolText} title={tools.tool_writing}>
        <em className="icon icon-text tool-icon" />
        <div
          className="tool-pen-list-extend text"
          style={{
            display: showSelectType === 'textPanel' && isActive === 'tool_text' ? 'block' : 'none',
          }}
          onClick={changePen}
          onMouseLeave={hideAllSelectBox}
        >
          {fontoptionsIsShow ? (
            undefined
          ) : (
            <div className="font-container" onClick={changeFontFamily}>
              <button className={`font-family-option Msyh ${fontFamily === '微软雅黑' ? 'active' : ''}`} data-fontfamily="微软雅黑">
                微软雅黑
              </button>
              <button className={`font-family-option Ming ${fontFamily === '宋体' ? 'active' : ''}`} data-fontfamily="宋体">
                宋体
              </button>
              <button className={`font-family-option Arial ${fontFamily === 'Arial' ? 'active' : ''}`} data-fontfamily="Arial">
                Arial
              </button>
            </div>
          )}
          <div className="tool-slider">
            <YsSliderDumb value={fontSize} onAfterChange={changeFontSize} />
          </div>
          <div style={{ position: 'relative', borderTop: '1px solid #DEEAFF', marginLeft: '10px' }}>
            <ColorPicker setLineColor={setLineColor} selectColor={primaryColor} />
          </div>

          <em className="icon-jiantou"></em>
        </div>
        <em className="icon-more"></em>
      </li>
    );
  }
}
