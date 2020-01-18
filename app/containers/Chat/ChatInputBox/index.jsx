import React, { Component } from 'react';
import { liveRoom, EVENT_TYPE } from '@global/roomConstants';
import { YsGlobal } from '@global/handleGlobal';
import { myself } from '@utils/';
import ChatInputBtn from './ChatInputBtn/ChatInputBtn';
import ChatSubject from './ChatSubject/ChatSubject';
import ChatSendBtn from './ChatSendBtn/ChatSendBtn';
const { chatSendBtn } = YsGlobal.languageInfo.chat;
const { chatInput, chatSubject } = YsGlobal.languageInfo.chat;
export class ChatInputBoxMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disablechat: false,
    };
    this.listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
  }

  componentDidMount() {
    liveRoom.addEventListener(EVENT_TYPE.roomUserPropertyChanged, this.handleUserPropertyChanged.bind(this), this.listernerBackupid);
  }

  handleUserPropertyChanged = data => {
    const { user, message } = data;
    if (myself().id === user.id) {
      this.setState({
        disablechat: message.disablechat,
      });
    }
  };

  componentWillUnmount() {
    liveRoom.removeBackupListerner(this.listernerBackupid);
  }

  keyboardClick() {
    this.props.setqqFaceShow();
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

  handleInputOnFocus() {
    this.props.setqqFaceShow();
  }

  render() {
    const EmoticonArrUI = this.props.EmoticonArrUI();
    const { selectFuc, selectChat, liveAllNoChatSpeaking, roleSelectShow, chatRoleSelectIndex } = this.props;
    const isDisabledChat = (YsGlobal.roomInfo.isLiveRoom ? liveAllNoChatSpeaking : this.state.disablechat) && myself().role === 2;
    const { canChat } = YsGlobal.roomConfigItem;
    const banChatClassName = !canChat && !this.props.isClassBegin ? 'ban-chat' : '';
    return (
      <React.Fragment>
        <div className={`chat-input-mobile ${banChatClassName}`}>
          <div className="chat-inputbox">
            {YsGlobal.roomInfo.isLiveRoom && selectChat === 0 && (
              <div onClick={() => selectFuc('flowers')} className={`icon flowers ${this.props.flowersNum > 0 ? '' : 'cur'}`} title={chatInput.flowersTitle}>
                <span className="flowersNum">{this.props.flowersNum} </span>
              </div>
            )}

            <div className="chat-subject2">
              {YsGlobal.roomInfo.isLiveRoom && selectChat === 0 && (
                <div className="privateChat2">
                  {chatInput.toSomeOnem}
                  <label onClick={this.setPrivatePageIsShow.bind(this, true)}>{this.props.selectUserNickname || chatInput.owner}</label>:
                </div>
              )}
              <input
                className="input"
                type="text"
                value={this.props.chatMsg}
                onFocus={this.handleInputOnFocus.bind(this)}
                onChange={e => this.props.setChatMsg(e)}
                maxLength="140"
                placeholder={isDisabledChat ? chatSubject.forbid : chatSubject.maxNumber}
                disabled={isDisabledChat}
                onKeyDown={e => this.props.handleEditableOnKeyDown(e)}
              />
            </div>

            {selectChat === 0 && (
              <React.Fragment>
                <div onClick={() => selectFuc('emotion')} className={`mr12 biaoqing ${this.props.qqFaceShow ? 'hide' : ''}`} title={chatInput.phiz}></div>

                <div
                  onClick={this.keyboardClick.bind(this)}
                  className={`mr12 biaoqinghas ${this.props.qqFaceShow ? '' : 'hide'}`}
                  title={chatInput.keyCode}
                ></div>
              </React.Fragment>
            )}

            {/* 看谁消息 */}
            {YsGlobal.roomInfo.isLiveRoom && selectChat === 0 && (
              <div className="tosee-box mr12">
                <div
                  onClick={() => selectFuc('tosee')}
                  className={`icon_kejian_mobileIcon ${chatRoleSelectIndex !== 0 || roleSelectShow ? 'cur' : ''} ${
                    roleSelectShow ? 'in' : ''
                  } cursee${chatRoleSelectIndex}`}
                  disabled={false}
                  title={chatInput.justLook}
                />
                <ul className={roleSelectShow ? 'roleSelect icon-modal' : 'roleSelect icon-modal hide'}>
                  <li className={chatRoleSelectIndex === 0 ? 'active' : ''} onClick={() => selectFuc('selectRole', 0)}>
                    {chatInput.allMsg}
                  </li>
                  <li className={chatRoleSelectIndex === 2 ? 'active' : ''} onClick={() => selectFuc('selectRole', 2)}>
                    {chatInput.onlyAnchor}
                  </li>
                  <li className={chatRoleSelectIndex === 1 ? 'active' : ''} onClick={() => selectFuc('selectRole', 1)}>
                    {chatInput.lookMe}
                  </li>
                </ul>
              </div>
            )}
            {selectChat === 0 && <div className="sendMsg" onClick={() => this.props._commonHandleClick()} />}

            {selectChat !== 0 && (
              <div className="sendQuestionBtn" onClick={() => this.props._commonHandleClick()}>
                {chatSendBtn.sendBtn}
              </div>
            )}
          </div>

          <ul className={`chat-qqFaceBox ${this.props.qqFaceShow ? '' : 'hide'}`}>{EmoticonArrUI}</ul>
        </div>

        {/* 对谁聊天列表 */}
        {/* <div className={`privatePage ${selectChat === 0 && this.state.privatePageIsShow ? '' : 'hide'}`}>
          <div className="private-header">
            <i className="icon icon-down" onClick={this.setPrivatePageIsShow.bind(this, false)}></i>
            {chatInput.nameList}
          </div>
          <div className="private-content">
            <ul>
              <li className={this.props.selectUserID === '' ? 'cur' : ''} onClick={this.privateHandle.bind(this, '', chatInput.owner)}>
                {chatInput.owner}
              </li>
            </ul>
            <ul>
              {this.props.userListArr.map((user, i) => (
                <li className={this.props.selectUserID === user.id ? 'cur' : ''} key={i + 1} onClick={this.privateHandle.bind(this, user.id, user.nickname)}>
                  {user.nickname}
                </li>
              ))}
            </ul>
          </div>
          <div className="private-footBtn" onClick={this.setPrivatePageIsShow.bind(this, false)}>
            {chatInput.sure}
          </div>
        </div> */}
      </React.Fragment>
    );
  }
}

export class ChatInputDefault extends Component {
  render() {
    // this.props.selectChat !== 2 只有不是上麦tab栏才显示inputBox
    const { canChat } = YsGlobal.roomConfigItem;
    const banChatClassName = !canChat && !this.props.isClassBegin ? 'ban-chat' : '';
    return (
      <React.Fragment>
        {!this.props.inputHide && this.props.selectChat !== 2 && !YsGlobal.playback && (
          <div className={`chat-input ${banChatClassName}`} onMouseLeave={() => this.props.handleOnMouseLeave()}>
            <ChatInputBtn {...this.props} />
            <ChatSubject onRef={this.props.onRef} {...this.props} />
            <ChatSendBtn {...this.props} />
            {/* <ChatTip
                            {...this.props}
                        />  */}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default ChatInputDefault;
