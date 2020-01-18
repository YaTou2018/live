import React, { Component } from 'react';
import { YsGlobal } from '@global/handleGlobal';
import * as Actions from '@containers/Chat/state/actions';
import { connect } from 'react-redux';

const { chatInput } = YsGlobal.languageInfo.chat;

export class ChatNameList extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  setPrivatePageIsShow(value) {
    this.props.setnameListIsShow(value);
  }

  privateHandle(id, nickname) {
    this.props.handleUserChange({
      selectUserID: id,
      selectUserNickname: nickname,
    });
  }

  render() {
    const { selectChat, privatePageIsShow } = this.props;
    return (
      <React.Fragment>
        <div className={`privatePage ${selectChat === 0 && privatePageIsShow ? '' : 'hide'}`}>
          <div className="private-header">
            <i className="icon icon-down" onClick={this.setPrivatePageIsShow.bind(this, false)}></i>
            {chatInput.nameList}
          </div>
          <div className="private-content">
            <ul>
              <li className={`private_one ${this.props.selectUserID === '' ? 'cur' : ''}`} onClick={this.privateHandle.bind(this, '', chatInput.owner)}>
                <div className="redioWho">
                  <div className={this.props.selectUserID === '' ? 'redioWhoChiose' : ''}></div>
                </div>
                <span className="chioseWho">{chatInput.owner}</span>
              </li>
            </ul>
            <ul>
              {this.props.userListArr.map((user, i) => (
                <li className={this.props.selectUserID === user.id ? 'cur' : ''} key={i + 1} onClick={this.privateHandle.bind(this, user.id, user.nickname)}>
                  <div className="redioWho">
                    <div className={this.props.selectUserID === user.id ? 'redioWhoChiose' : ''}></div>
                  </div>
                  <span> {user.nickname}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="private-footBtn" onClick={this.setPrivatePageIsShow.bind(this, false)}>
            {chatInput.sure}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.chat.privateData,
    liveAllNoChatSpeaking: state.chat.liveAllNoChatSpeaking,
    selectChat: state.chat.selectChat,
  };
};

const mapDispatchToProps = () => {
  return {
    handleUserChange: data => {
      Actions.setPrivata(data);
    },
    setnameListIsShow: filterId => {
      Actions.setnameListIsShow(filterId);
    },
  };
};

// 连接组件
export default connect(mapStateToProps, mapDispatchToProps)(ChatNameList);
