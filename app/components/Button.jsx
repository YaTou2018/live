/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import '../styles/Button';
export default class Button extends Component {
  onClick() {
    if (typeof this.props.onClick === 'function') return this.props.onClick();
    return false;
  }

  render() {
    const { children, type = '', className = '' } = this.props;

    return (
      <button
        className={`btn ${type} ${className}`}
        onClick={this.onClick.bind(this)}
      >
        {children}
      </button>
    );
  }
}
