import React from 'react';
// import YsGlobal from "YsGlobal";
import ColorPicker from '@components/ColorPicker/ColorPicker';
import YsSliderDumb from '@components/slider/YsSlider';
import { YsGlobal } from '@global/handleGlobal';
import { compare } from '@utils/';
const { tools } = YsGlobal.languageInfo.whiteboard;
export default class ToolShapeList extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (compare(this.props, nextProps) || compare(this.props, nextProps)) {
      return true;
    }
    return false;
  }

  shapeActive(value) {
    const checkArr = ['tool_rectangle_empty', 'tool_rectangle', 'tool_ellipse_empty', 'tool_ellipse'];
    return checkArr.indexOf(value) !== -1 ? value : '';
  }

  render() {
    const {
      showShapeList,
      showSelectType,
      changeShape,
      hideAllSelectBox,
      setLineColor,
      onAfterChangeShapeLineWidth,
      shape,
      isActive,
      primaryColor,
      shapeWidth,
    } = this.props;

    return (
      <li
        className={`tool-option shape-list ${shape} ${isActive === this.shapeActive(shape) ? 'active' : ''}`}
        data-current-shape={shape}
        onClick={showShapeList}
        title={tools.tool_shape}
      >
        <em className={`icon icon-${shape} tool-icon`} />
        <div
          className="tool-shape-list-extend"
          style={{
            display: showSelectType === 'shapePanel' && isActive === this.shapeActive(shape) ? 'block' : 'none',
          }}
          onClick={changeShape}
          onMouseLeave={hideAllSelectBox}
        >
          <ol className="tool-shape-container">
            <li className={`shape-option tool_rectangle_empty ${isActive === 'tool_rectangle_empty' ? 'active' : ''}`}>
              <em data-type="tool_rectangle_empty" className="icon-tool_rectangle_empty" />
            </li>
            <li className={`shape-option tool_rectangle ${isActive === 'tool_rectangle' ? 'active' : ''}`}>
              <em data-type="tool_rectangle" className="icon-tool_rectangle" />
            </li>
            <li className={`shape-option tool_ellipse_empty ${isActive === 'tool_ellipse_empty' ? 'active' : ''}`}>
              <em data-type="tool_ellipse_empty" className="icon-tool_ellipse_empty" />
            </li>
            <li className={`shape-option tool_ellipse ${isActive === 'tool_ellipse' ? 'active' : ''}`}>
              <em data-type="tool_ellipse" className="icon-tool_ellipse" />
            </li>
          </ol>
          <div className="tool-slider">
            <YsSliderDumb value={shapeWidth} onAfterChange={onAfterChangeShapeLineWidth} />
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
