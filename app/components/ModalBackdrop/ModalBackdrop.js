/** 弹框遮罩层 */

import React from 'react';
import { connect } from 'react-redux';
import Actions from '@global/actions';
import './static/sass/index.scss';

class ModalBackdrop extends React.Component {
  render() {
    const { visible } = this.props;
    /** 点名/抽奖/菜单栏 点击 */
    const isShow = visible !== '' && visible !== undefined;

    return <div className={`${isShow ? 'in' : ''} modal-backdrop`} onClick={() => this.props.activeToggle()} />;
  }
}

const mapStateToProps = state => ({
  visible: state.common.visible,
});

const mapDispatchToProps = dispatch => ({
  activeToggle: () => {
    dispatch(Actions.toggleNavbar());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalBackdrop);
