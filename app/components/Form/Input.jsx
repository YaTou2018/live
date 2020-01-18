import React, { PureComponent } from 'react';

import '@styles/Form/Input';

export default class Input extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      value: props.defaultValue ? props.defaultValue : '',
    };
  }

  onChange(e) {
    const { value } = e.target;
    this.setState({
      value: value && value.trimLeft(),
    });
    if (typeof this.props.onChange === 'function') this.props.onChange(value);
  }

  cleanInput(e) {
    e.stopPropagation();
    this.setState({
      value: '',
    });
    if (typeof this.props.onChange === 'function') this.props.onChange('');
  }

  render() {
    // eslint-disable-next-line radix
    const defaultId = `input_${new Date().valueOf() + parseInt(Math.random() * 1000)}`;
    const { type, className = '', id = defaultId, name = defaultId, showClean, placeholder = '', maxLength, value: propsValue } = this.props;
    const { value } = this.state;

    if (['checkbox', 'radio'].includes(type)) {
      // eslint-disable-next-line no-console
      console.error(
        `Error: Exception type '${type}', please use <input type='${type}'/> or component '${type.substring(0, 1).toUpperCase() + type.substring(1)}'.`,
      );
      return null;
    }
    return (
      <div className="input-label">
        <input
          id={id}
          placeholder={placeholder}
          name={name}
          className={`input-item ${className}`}
          type={type}
          value={propsValue || value}
          maxLength={maxLength}
          onChange={this.onChange.bind(this)}
          autoComplete="off"
        />
        {showClean && <span className="clean-icon" onClick={this.cleanInput.bind(this)}></span>}
      </div>
    );
  }
}
