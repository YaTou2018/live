/**
 * Slider Dumb组件
 * @module YSSliderDumb
 * @description   提供 滑动字体大小或橡皮擦大小 组件
 * @author xiagd
 * @date 2017/08/10
 */

import React from 'react';
import Slider from 'rc-slider';
import './static/index.scss';

class YSSliderDumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateState: false,
    };
    this.isSlidering = false; // 是否正在slider
    this.changeValue = undefined;
    this.onChange = this.onChange.bind(this);
    this.onBeforeChange = this.onBeforeChange.bind(this);
    this.onAfterChange = this.onAfterChange.bind(this);
  }

  onChange(value) {
    if (this.isSlidering) {
      this.changeValue = value;
      const prev = this.state.updateState;
      this.setState({ updateState: !prev });
    }
    if (this.props.onChange && typeof this.props.onChange === 'function') {
      this.props.onChange(value);
    }
  }

  onBeforeChange(value) {
    this.isSlidering = true;
    this.changeValue = value;
    if (this.props.onBeforeChange && typeof this.props.onBeforeChange === 'function') {
      this.props.onBeforeChange(value);
    }
  }

  onAfterChange(value) {
    this.isSlidering = false;
    this.changeValue = undefined;
    if (this.props.onAfterChange && typeof this.props.onAfterChange === 'function') {
      this.props.onAfterChange(value);
    }
  }

  render() {
    const { className, disabled, vertical, style, value } = this.props;
    // console.error('===> render: ', value);
    return (
      <Slider
        style={style}
        vertical={vertical}
        className={className}
        disabled={disabled}
        value={this.changeValue !== undefined ? this.changeValue : value}
        onChange={this.onChange}
        onBeforeChange={this.onBeforeChange}
        onAfterChange={this.onAfterChange}
      />
    );
  }
}

export default YSSliderDumb;
