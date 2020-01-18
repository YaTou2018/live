import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class RadioGroup extends PureComponent {
  constructor(props) {
    super();
    // eslint-disable-next-line radix
    const defaultId = `radio_${new Date().valueOf() + parseInt(Math.random() * 1000)}`;
    const { value, id = defaultId } = props;
    this.state = {
      id,
      selectedValue: value,
    };
  }

  onChange(value) {
    this.setState({
      selectedValue: value,
    });
    if (typeof this.props.onChange === 'function') this.props.onChange(value);
  }

  getChildContext() {
    const { name } = this.props;
    const { selectedValue } = this.state;
    return {
      radioGroup: {
        name,
        selectedValue,
        onChange: this.onChange.bind(this),
      },
    };
  }

  render() {
    const { id } = this.state;
    const { className = '', children } = this.props;

    return (
      <div className={`radio-group ${className}`} id={id}>
        {children}
      </div>
    );
  }
}

RadioGroup.childContextTypes = {
  radioGroup: PropTypes.object,
};
