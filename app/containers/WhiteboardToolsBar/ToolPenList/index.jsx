import React from 'react';
import ColorPicker from '@components/ColorPicker/ColorPicker';
import YsSliderDumb from '@components/slider/YsSlider';
import { YsGlobal } from '@global/handleGlobal';
import { compare } from '@utils/';
const { tools } = YsGlobal.languageInfo.whiteboard;
export default class ToolPenList extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (compare(this.props, nextProps) || compare(this.props, nextProps)) {
      return true;
    }
    return false;
  }

  penActive(value) {
    const checkArr = ['tool_pencil', 'tool_highlighter', 'tool_line', 'tool_arrow'];
    return checkArr.indexOf(value) !== -1 ? value : '';
  }

  render() {
    const {
      showPenList,
      showSelectType,
      changePen,
      hideAllSelectBox,
      setLineColor,
      onAfterChangePenLineWidth,
      pen,
      isActive,
      primaryColor,
      penWidth,
    } = this.props;

    return (
      <li
        className={`tool-option pen-list ${pen} ${isActive === this.penActive(pen) ? 'active' : ''}`}
        data-current-pen={pen}
        onClick={showPenList}
        title={tools.tool_pen}
      >
        <em className={`icon icon-${pen} tool-icon`} />
        <div
          className="tool-pen-list-extend "
          style={{
            display: showSelectType === 'penPanel' && isActive === this.penActive(pen) ? 'block' : 'none',
          }}
          onClick={changePen}
          onMouseLeave={hideAllSelectBox}
        >
          <ol className="tool-pen-box">
            <li className={`pen-option tool_pencil ${pen === 'tool_pencil' ? 'active' : ''}`}>
              <em data-type="tool_pencil" className="icon-tool_pencil" />
            </li>
            <li className={`pen-option tool_highlighter ${pen === 'tool_highlighter' ? 'active' : ''}`}>
              <em data-type="tool_highlighter" className="icon-tool_highlighter" />
            </li>
            <li className={`pen-option tool_line ${pen === 'tool_line' ? 'active' : ''}`}>
              <em data-type="tool_line" className="icon-tool_line" />
            </li>
            <li className={`pen-option tool_arrow ${pen === 'tool_arrow' ? 'active' : ''}`}>
              <em data-type="tool_arrow" className="icon-tool_arrow" />
            </li>
          </ol>
          <div className="tool-slider">
            <YsSliderDumb value={penWidth} onAfterChange={onAfterChangePenLineWidth} />
          </div>

          <div style={{ position: 'relative', borderTop: '1px solid #DEEAFF', marginLeft: '10px' }}>
            <ColorPicker setLineColor={setLineColor} selectColor={primaryColor} />
          </div>

          <em className="icon-jiantou" />
        </div>
        <em className="icon-more" />
      </li>
    );
  }
}
