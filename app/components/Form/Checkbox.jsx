import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '@styles/Form/Checkbox';

export default class Checkbox extends Component {
  onChange(e) {
    if (!this.context || !this.context.checkBoxGroup) {
      // eslint-disable-next-line no-unused-expressions
      typeof this.props.onChange === 'function' && this.props.onChange(e.target.checked);
      return;
    }
    const { onChange, selectedValue } = this.context.checkBoxGroup;
    const { value, checked } = e.target;
    let selecteds = selectedValue;
    if (checked) {
      // eslint-disable-next-line no-unused-expressions
      !selecteds.includes(value) && selecteds.push(value);
    } else {
      selecteds = selecteds.filter(val => val !== value);
    }
    // eslint-disable-next-line no-unused-expressions
    typeof onChange === 'function' && onChange(selecteds);
  }

  render() {
    // eslint-disable-next-line radix
    const defaultId = `checkbox_${new Date().valueOf() + parseInt(Math.random() * 1000)}`;
    const { className = '', id = defaultId, children, value } = this.props;
    let groupInfo = {
      name: this.props.name || defaultId,
      selectedValue: [],
    };
    if (this.context && this.context.checkBoxGroup) {
      groupInfo = this.context.checkBoxGroup;
    } else if (this.props.checked) {
      groupInfo.selectedValue = [value];
    }
    const { name, selectedValue } = groupInfo;
    const selected = selectedValue.includes(value);

    return (
      <label htmlFor={id} className={`checkbox-label ${className} ${selected ? 'selected' : ''}`}>
        <div>{children}</div>
        <input id={id} name={name} checked={selected} className="checkbox-item" value={value} type="checkbox" onChange={this.onChange.bind(this)} />
      </label>
    );
  }
}

Checkbox.contextTypes = {
  checkBoxGroup: PropTypes.object,
};
