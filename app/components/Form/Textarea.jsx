import React, { PureComponent } from 'react';

import '@styles/Form/Textarea';

export default class Textarea extends PureComponent {
  onChange(e) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(e.target.value);
    }
  }

  render() {
    const defaultId = `textarea_${new Date().valueOf() + parseInt(Math.random() * 1000, 10)}`;
    const { defaultValue, className = '', id = defaultId, name = defaultId, maxLength, placeholder = '' } = this.props;

    return (
      <textarea
        id={id}
        name={name}
        className={`textarea-item vote-scrollBar ${className}`}
        defaultValue={defaultValue}
        onChange={this.onChange.bind(this)}
        maxLength={maxLength}
        placeholder={placeholder}
      />
    );
  }
}
