import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class CheckboxGroup extends PureComponent {
  constructor(props) {
    super();
    // eslint-disable-next-line radix
    const defaultId = `checkbox_${new Date().valueOf() + parseInt(Math.random() * 1000)}`;
    const { value = [], id = defaultId, name = defaultId } = props;
    let selectedValue = value;
    if (!(selectedValue instanceof Array)) {
      selectedValue = [selectedValue];
    }
    this.state = {
      id,
      selectedValue,
      // eslint-disable-next-line react/no-unused-state
      name,
    };
  }

  onChange(value) {
    this.setState({
      selectedValue: value,
    });
    // eslint-disable-next-line no-unused-expressions
    typeof this.props.onChange === 'function' && this.props.onChange(value);
  }

  getChildContext() {
    const { name } = this.props;
    const { selectedValue } = this.state;
    return {
      checkBoxGroup: {
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
      <div className={`checkbox-group vote-scrollBar ${className}`} id={id}>
        {children}
      </div>
    );
  }
}

CheckboxGroup.childContextTypes = {
  checkBoxGroup: PropTypes.object,
};
