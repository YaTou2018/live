import React, { Component } from 'react';
// import eventObjectDefine from 'eventObjectDefine';

import { liveRoom } from '@global/roomConstants';
import ChatItemTest from './ChatItemTest';
import ChatItemImg from './ChatItemImg';
import ChatItemNotice from './ChatItemNotice';
import { YsGlobal } from '../../../../global/handleGlobal';

class ChatItem extends Component {
  headerNameClick = () => {
    const chatMsgData = this.props.contents || {};
    const { banPrivateChat } = YsGlobal.roomConfigItem;
    if (chatMsgData.isMe || !YsGlobal.roomInfo.isLiveRoom || banPrivateChat) return;

    /* 点击用户名称 私聊 */
    const selectUserID = chatMsgData.fromID;
    const selectUserNickname = chatMsgData.fromName;
    const users = this.props.userListArr;
    let flag = false;
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === selectUserID) {
        flag = true;
        this.props.handleUserChange({
          selectUserID,
          selectUserNickname,
        });
        break;
      }
    }
    if (!flag) {
      const data = {};
      const userArr = [];
      data.id = selectUserID;
      data.nickname = selectUserNickname;
      userArr.push(data);
      this.props.handleUserChange({
        selectUserID,
        selectUserNickname,
        userListArr: userArr,
      });
    }
  };

  // 加载完成 通知容器组件更新 滚动条置底
  onLoads = () => {
    liveRoom.dispatchEvent({ type: 'chatScrollChange' });
  };

  render() {
    const { contents: item, index } = this.props;
    return (
      <React.Fragment>
        <li className="chat-item-warp">
          {item.msgtype === 'text' ? <ChatItemTest contents={item} index={index} headerNameClick={this.headerNameClick} onLoads={this.onLoads} /> : null}
          {item.msgtype === 'onlyimg' ? <ChatItemImg contents={item} index={index} headerNameClick={this.headerNameClick} onLoads={this.onLoads} /> : null}
          {item.msgtype === 'notice' ? <ChatItemNotice contents={item} index={index} onLoads={this.onLoads} /> : null}
        </li>
      </React.Fragment>
    );
  }
}
export default ChatItem;
