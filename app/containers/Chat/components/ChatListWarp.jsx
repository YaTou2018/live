import React, { Component } from 'react';
import { liveRoom } from '@global/roomConstants';
import { throttle } from '@utils/filter';
import { YsGlobal } from '@global/handleGlobal';
class ChatListWarp extends Component {
  messagesEnd = React.createRef();

  listernerBackupid = new Date().getTime();

  needScrollGoDown = false;

  componentDidMount() {
    liveRoom.addEventListener('chatScrollChange', throttle(this.scrollToBottom, 300), this.listernerBackupid); // 监听到就将滚动条置底
    if (YsGlobal.isMobile) {
      const $listPanel = document.querySelector(`.${this.props.classNames}`);
      if (!$listPanel) return;
      $listPanel.addEventListener(
        'touchstart',
        () => {
          this.needScrollGoDown = false;
        },
        false,
      );
      $listPanel.addEventListener(
        'touchend',
        () => {
          this.needScrollGoDown = true;
        },
        false,
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isShow || !this.messagesEnd) return;
    if (nextProps.classNames === 'ChatMsgList') {
      const $chatList = this.messagesEnd.querySelector('ul.chat-msglist');
      this.needScrollGoDown = this.isNeedScrollPC($chatList);
    } else {
      this.needScrollGoDown = this.isNeedScrollPC(this.messagesEnd);
    }
  }

  componentWillUnmount() {
    liveRoom.removeBackupListerner(this.listernerBackupid);
  }

  scrollToBottom = () => {
    if (!this.props.isShow || !this.messagesEnd) return;
    if (this.props.classNames === 'ChatMsgList') {
      const $chatList = this.messagesEnd.querySelector('ul.chat-msglist');
      if (this.needScrollGoDown || this.props.lastChatItemIsmine) {
        $chatList.scrollTop = $chatList.scrollHeight;
      }
    } else if (this.needScrollGoDown) {
      this.messagesEnd.scrollTop = this.messagesEnd.scrollHeight;
    }
    // this.timer = setTimeout(() => {
    // clearTimeout(this.timer)
    // }, 100);
  };

  isNeedScrollPC($ele) {
    return Boolean($ele.offsetHeight + $ele.scrollTop + 5 >= $ele.scrollHeight);
  }

  render() {
    const { children, isShow, classNames } = this.props;
    return (
      <section
        className={`chat-list-warp ${classNames}`}
        style={{ display: isShow ? '' : 'none' }}
        ref={div => {
          this.messagesEnd = div;
        }}
      >
        {children}
        {/* <div style={{  }} ref={div=>{this.messagesEnd1 = div}}/> */}
      </section>
    );
  }
}

export default ChatListWarp;
