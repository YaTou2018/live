/* 弹框 组件 */
import React from 'react';
import PropTypes from 'prop-types';
import Actions from '@global/actions';
import { Textarea } from '@components/Form';
import { connect } from 'react-redux';
import './static/sass/index.scss';
import { YsGlobal } from '@global/handleGlobal';
const { pubpanerInner } = YsGlobal.languageInfo.voteCom;

class ShowAlert extends React.Component {
  constructor(props) {
    super(props);
    // this.subNode_1 = '';
    this.onChange = this.onChange.bind(this);
    this.state = {
      subNode_1: '',
    };
  }

  /* 按钮，取消/关闭弹框,alert 确认 */
  modalCloseClick(callback) {
    this.props.hideModal();
    callback(false);
  }

  /* 按钮，confirm 确定 */
  confirmClick(callback) {
    const data = {
      text: this.state.subNode_1,
    };
    if (callback(true, data)) {
      this.props.hideModal();
    }
    if (!this.state.subNode_1) return;
    // 自定义表单需要回传数据
    this.setState({
      subNode_1: '',
    });
  }

  onChange(data) {
    this.setState({
      subNode_1: data,
    });
  }

  loadContent(modalMessage) {
    let content;
    if (modalMessage.type !== 'custom') {
      content = modalMessage.message;
    } else {
      switch (modalMessage.customContent.type) {
        case 'edit-textarea':
          content = (
            <div>
              <label>{modalMessage.customContent.label}</label>
              <Textarea maxLength="50" onChange={this.onChange} />
              {!this.state.subNode_1 && modalMessage.customContent.warnMsg && <label className="warning">{modalMessage.customContent.warnMsg}</label>}
            </div>
          );
          break;
        default:
          break;
      }
    }
    return content;
  }

  render() {
    // const modalIsShow = true;
    // const modalMessage = {
    //     message: "test", // alert、comfirm 内容
    //     cancleBtn: '取消', // 取消按钮
    //     okBtn: "确定", //确定按钮
    //     title: "发布公告", // 标题
    //     type: "comfirm", // 类型，alert、comfirm、costom
    //     customContent: { // 自定义内容
    //         label: '11111',
    //         type: 'edit-textarea',
    //     }
    // }
    const { modalIsShow, modalMessage } = this.props;
    const { title, okBtn, type, callback } = modalMessage;
    const TYPEALERT = 'alert';
    const TYPECOMFIRM = 'comfirm';
    const TYPEFORM = 'custom';
    const content = this.loadContent(modalMessage);
    return (
      <section className={`modal-wrapper ${type === TYPEFORM ? 'custom-wrapper' : 'add-bg'}`} style={{ display: modalIsShow ? 'block' : 'none' }}>
        <div className="modal-box">
          <div className="modal-title">
            <p className="title-text">{title}</p>
            {type !== TYPECOMFIRM && (
              <button type="button" className="title-close" onClick={this.modalCloseClick.bind(this, callback)}>
                <i className="icon icon-del" />
              </button>
            )}
          </div>
          <div className="modal-contant">{content}</div>
          <div className="modal-footer">
            {type !== TYPEALERT && (
              <button type="button" className="cancle-btn" onClick={this.modalCloseClick.bind(this, callback)}>
                {/* {cancleBtn} */}
                {pubpanerInner.cancel}
              </button>
            )}
            <button type="button" className="ok-btn" onClick={this.confirmClick.bind(this, callback)}>
              {okBtn}
            </button>
          </div>
        </div>
      </section>
    );
  }
}

ShowAlert.propTypes = {
  modalIsShow: PropTypes.bool,
  modalMessage: PropTypes.object,
  hideModal: PropTypes.func,
};

const mapStateToProps = state => ({
  modalIsShow: state.common.modalIsShow,
  modalMessage: state.common.modalMessage,
});

const mapDispatchToProps = dispatch => ({
  hideModal: () => {
    dispatch(Actions.hideModal());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowAlert);
