import React, { PureComponent } from 'react';

import '@styles/Form/FormItem';

export default class FormItem extends PureComponent {
  onChange(value) {
    // eslint-disable-next-line no-unused-expressions
    typeof this.props.onChange === 'function' && this.props.onChange(value);
  }

  render() {
    const { label, children, fileId, className = '' } = this.props;

    return (
      <div className={`form-item ${className}`}>
        {label && (
          <label htmlFor={fileId} className="form-label">
            {label}：
          </label>
        )}
        <div className={`form-field ${label ? '' : 'no-label'}`}>{children}</div>
      </div>
    );
  }
}
