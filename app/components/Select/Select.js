/**
 * Select Dumb组件
 * @module SelectDumb
 * @description   提供 Select基础组件
 * @author QiuShao
 * @date 2017/08/11
 */

import React from 'react';
import './static/sass/index.scss';

class SelectDumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      extendShow: false,
    };
  }

  optionOnClick(id, type, event) {
    this.setState({ extendShow: false });
    if (id !== this.props.currentValue) {
      if (this.props.onChange && typeof this.props.onChange === 'function') {
        this.props.onChange(type, id, event);
      }
    }
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    return false;
  }

  currentTextOnClick(event) {
    const prev = this.state.extendShow;
    this.setState({ extendShow: !prev });
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    return false;
  }

  selectContainerOnMouseLeave(event) {
    this.setState({ extendShow: false });
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    return false;
  }

  render() {
    const { selectOptions = [], currentValue, type } = this.props;
    let currentLabel;
    selectOptions.forEach(selectOption => {
      if (selectOption.deviceId === currentValue) {
        currentLabel = selectOption.label;
      }
    });
    return (
      <div className="item_right select_box" onMouseLeave={this.selectContainerOnMouseLeave.bind(this)}>
        <div className="select_text" onClick={this.currentTextOnClick.bind(this)}>
          <span>{currentLabel} </span>
          <i className={`sjSelect ${this.state.extendShow ? 'sjUp' : 'sjDown'}`}></i>
        </div>
        <ol className="select-list down" style={{ display: this.state.extendShow ? 'block' : 'none' }}>
          {selectOptions.length > 0 &&
            selectOptions.map(item => (
              <li key={item.deviceId} className="option" value={item.deviceId} onClick={this.optionOnClick.bind(this, item.deviceId, type)}>
                {item.label}
              </li> // selected
            ))}
        </ol>
      </div>
    );
  }
}

export default SelectDumb;
