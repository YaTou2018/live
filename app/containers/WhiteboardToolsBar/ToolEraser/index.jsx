import React from 'react';
import YsSliderDumb from '@components/slider/YsSlider';
import { YsGlobal } from '@global/handleGlobal';
import { compare } from '@utils/';
const { tools } = YsGlobal.languageInfo.whiteboard;
export default class ToolEraser extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (compare(this.props, nextProps) || compare(this.props, nextProps)) {
      return true;
    }
    return false;
  }

  render() {
    const { openToolEraser, changeEraser, hideAllSelectBox, onAfterChangeEraserWidth, eraserDisabled, isActive, showSelectType, eraserWidth } = this.props;
    return (
      <li
        className={`tool-option tool_eraser ${eraserDisabled ? ' disabled' : ''}${isActive === 'tool_eraser' ? ' active' : ''}`}
        onClick={openToolEraser}
        title={tools.tool_eraser}
      >
        <em className="icon icon-xiangpi tool-icon" />
        <div
          className="tool-eraser-extend"
          style={{
            display: isActive === 'tool_eraser' && showSelectType === 'eraserPanel' ? 'block' : 'none',
          }}
          onClick={changeEraser}
          onMouseLeave={hideAllSelectBox}
        >
          <div className="tool-slider">
            <YsSliderDumb onAfterChange={onAfterChangeEraserWidth} value={eraserWidth} />
          </div>
          <em className="icon-jiantou"></em>
        </div>
        <em className="icon-more"></em>
      </li>
    );
  }
}
