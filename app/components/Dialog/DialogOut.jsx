import React, { Component } from 'react';
import { connect } from 'react-redux';
import { windowClose } from '@utils/ysUtils';
import { YsGlobal } from '@global/handleGlobal';
import Action from '../../global/actions';
import './static/sass/style.scss';

const dialogOutLan = YsGlobal.languageInfo.pagesText.dialogOut;

class DialogOut extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  closeBtnOut() {
    this.props.setMaskIsShow(true);
    windowClose();
  }

  render() {
    return (
      <>
        <div className="isOutMask">
          <div className="isOutContainer">
            <div className="top" onClick={() => this.props.setMaskIsShow(false)}></div>
            <div className="center">{dialogOutLan.question}</div>
            <div className="bottom">
              <button className="cancel_btn" onClick={() => this.props.setMaskIsShow(false)}>
                {dialogOutLan.cancel}
              </button>
              <button className="sure_btn" onClick={this.closeBtnOut.bind(this)}>
                {dialogOutLan.confirm}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  isShowOutLive: state.Modules.isShowOutLive,
});

const mapDispatchToProps = () => ({
  setMaskIsShow: data => {
    Action.isShowMobilemask(data);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DialogOut);
