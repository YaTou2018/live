import React, { Fragment } from 'react';
import Chat from './Chat';
import ClassNotice from './ClassNotice/ClassNotice';
import ChatRenderPosition from './components/ChatRenderPosition';
// 导出聊天模块
export function MobileChat(props) {
  return (
    <Fragment>
      <Chat selectMobileChat={0} isFromMobile {...props} />
    </Fragment>
  );
}

// 导出提问模块
export function MobileChatQusetions(props) {
  return (
    <Fragment>
      <Chat selectMobileChat={1} isFromMobile {...props} />
    </Fragment>
  );
}
export default Chat;
export { ClassNotice, Chat, ChatRenderPosition };
// export default MobileChat;
