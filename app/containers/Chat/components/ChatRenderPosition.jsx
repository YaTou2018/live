import React, { useState } from 'react';
import { YsGlobal } from '@global/handleGlobal';
import { liveRoom, ROOM_ROLE } from '@global/roomConstants';
import GlobalControlBtn from '@containers/GlobalControlBtn/GlobalControlBtn';

const ChatRenderPosition = props => {
  const { maxVideo, isLiveRoom } = YsGlobal.roomInfo;
  const [childShow, updateStatus] = useState(false);
  const { children, isVideoLayout, onetoone } = props;
  const isTeacher = () => {
    const user = liveRoom.getMySelf() || {};
    return user.role === ROOM_ROLE.TEACHER || user.role === ROOM_ROLE.ASSISTANT;
  };
  const is1to1FoldChat = Boolean(onetoone && !isVideoLayout);
  if (isVideoLayout || is1to1FoldChat) {
    return (
      <div className={`chat-position-container ${childShow ? 'open' : ''} ${is1to1FoldChat ? 'b55' : ''}`}>
        {childShow && children}
        <span className={`btn chat-status-btn ${childShow ? 'open' : ''}`} onClick={() => updateStatus(!childShow)}></span>
        {!isLiveRoom && isTeacher() && maxVideo > 2 && <GlobalControlBtn distinction="bottom" />}
      </div>
    );
  }
  return children;
};

export default ChatRenderPosition;
