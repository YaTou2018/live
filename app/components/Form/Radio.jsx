import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '@styles/Form/Radio';

export default class Radio extends Component {
  onChange(e) {
    if (!this.context || !this.context.radioGroup) {
      if (typeof this.props.onChange === 'function') this.props.onChange(e.target.checked);
      return;
    }
    const { onChange } = this.context.radioGroup;
    if (typeof onChange === 'function') onChange(e.target.value);
  }

  render() {
    // eslint-disable-next-line radix
    const defaultId = `radio_${new Date().valueOf() + parseInt(Math.random() * 1000)}`;
    const { className = '', id = defaultId, children, value } = this.props;
    let groupInfo = {
      name: this.props.name || defaultId,
      selectedValue: '',
    };
    if (this.context && this.context.radioGroup) {
      groupInfo = this.context.radioGroup;
    } else if (this.props.checked) {
      groupInfo.selectedValue = value;
    }
    const { name, selectedValue } = groupInfo;

    const selected = selectedValue === value;

    return (
      <label htmlFor={id} className={`radio-label ${className} ${selected ? 'selected' : ''}`}>
        <div>{children}</div>
        <input id={id} name={name} checked={selected} className="radio-item" value={value} type="radio" onChange={this.onChange.bind(this)} />
      </label>
    );
  }
}

Radio.contextTypes = {
  radioGroup: PropTypes.object,
};
