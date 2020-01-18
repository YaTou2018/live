import React, { Component } from 'react';
import { connect } from 'react-redux';
import { liveRoom } from '@global/roomConstants';
import { setChatNoticeBoard, setPrivata } from '@containers/Chat/state/actions';
import { YsGlobal } from '@global/handleGlobal';
import chatContainerListener from './ChatContainerListener';
import RemindMsg from './remindMsg';
import ChatItem from './ChatItem';
import ChatListWarp from '../components/ChatListWarp';

/**
 * 聊天消息的容器组件
 * @class ChatContainer
 * @extends {Component}
 */
class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { remindMsgHeight: 0 };
  }

  listernerBackupid = new Date().getTime();

  componentDidMount() {
    chatContainerListener.getInstance();
  }

  // 生命周期钩子 销毁组件时
  componentWillUnmount() {
    if (chatContainerListener && typeof chatContainerListener.removeBackupListerner === 'function') {
      chatContainerListener.removeBackupListerner();
    }
  }

  getH(h) {
    this.setState({ remindMsgHeight: h });
  }

  render() {
    const { isShow, liveChatList, filterCondition, liveNoticeBoard, remindClose } = this.props;
    // noticeNotShow 是否不显示公告  默认不传  如果传true 就隐藏掉公告
    const { noticeNotShow = false } = this.props;
    const myUserId = liveRoom.getMySelf().id || {};
    let filterList = [];
    if (filterCondition === 'none') {
      filterList = liveChatList;
    } else if (filterCondition !== myUserId) {
      // 主看主播
      const noticeList = liveChatList.filter(it => it.fromID === myUserId && it.type !== 'flowers' && it.msgtype === 'notice');
      const { id } = noticeList.slice(noticeList.length - 1)[0];
      filterList = liveChatList.filter(it => it.fromID === filterCondition || id === it.id);
    } else if (filterCondition === myUserId) {
      // 只看自己
      const noticeList = liveChatList.filter(it => it.fromID === myUserId && it.type !== 'flowers' && it.msgtype === 'notice');
      const { id } = noticeList.slice(noticeList.length - 1)[0];
      filterList = liveChatList.filter(it => (it.fromID === myUserId && it.type !== 'flowers' && it.msgtype !== 'notice') || id === it.id);
    }
    const lastChatItem = filterList[filterList.length - 1] || {};
    return (
      <ChatListWarp isShow={isShow} classNames="ChatMsgList" lastChatItemIsmine={lastChatItem.fromID === myUserId}>
        <div className="chatMsglist-container" style={{ paddingTop: !noticeNotShow && liveNoticeBoard ? `${this.state.remindMsgHeight + 10}px` : '0' }}>
          {!noticeNotShow && liveNoticeBoard ? <RemindMsg getH={this.getH.bind(this)} test={liveNoticeBoard} remindClose={remindClose} /> : null}
          <ul className="chat-msglist callroll-list">
            {filterList.map((item, index) => (
              <ChatItem contents={item} index={index} key={item.id} {...this.props} />
            ))}
          </ul>
        </div>
      </ChatListWarp>
    );
  }
}

// 需要渲染什么数据
function mapStateToProps({ chat }) {
  return {
    liveChatList: chat.liveChatList,
    filterCondition: chat.filterCondition,
    liveNoticeBoard: chat.liveNoticeBoard,
    ...chat.privateData,
    ...chat.fontData,
  };
}
// 需要触发什么行为
function mapDispatchToProps(dispatch) {
  return {
    remindClose: () => {
      dispatch(setChatNoticeBoard(''));
    },
    handleUserChange: data => {
      setPrivata(data);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);
