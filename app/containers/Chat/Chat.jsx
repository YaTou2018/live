import React from 'react';
import { YsGlobal } from '@global/handleGlobal';
import { BASE_WIDTH, BASE_NUMBER } from '@global/roomConstants';
import { connect } from 'react-redux';
import * as Actions from '@containers/Chat/state/actions';
import ChatTitleBox from './ChatTitleBox/ChatTitleBox';
import ChatContainer from './ChatContainer/ChatContainer';
import QuestionAndAnswer from './QuestionAndAnswer/QuestionMsgList';
import ChatInputBox from './ChatInputBox/ChatInputBox';
import ChatOnWheat from './OnWheat/OnWheat';

import './static/Sass/chat.scss';
import './static/font/style.css';
const ChatBox = props => {
  const { isFromMobile, selectChat, selectMobileChat, isVideoLayout, onetoone, videoLen } = props;
  const scale = Number(YsGlobal.roomInfo.videoheight) / Number(YsGlobal.roomInfo.videowidth);
  const chatHeight = (BASE_WIDTH / BASE_NUMBER) * (25 / 100) * scale * videoLen;

  let style = {};
  if (!isVideoLayout && !onetoone) {
    style = { height: `calc(100% - ${chatHeight}rem)` };
  }

  return (
    <div className={`chat-container${isFromMobile ? ' mobile-chat' : ''}`} style={style}>
      {isFromMobile ? (
        <React.Fragment>
          {selectMobileChat === 0 && <ChatContainer isShow noticeNotShow />}
          {selectMobileChat === 1 && <QuestionAndAnswer isShow />}
          <ChatInputBox {...props} selectChat={selectMobileChat} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          {isVideoLayout || <ChatTitleBox {...props} />}
          <ChatContainer isShow={selectChat === 0} />
          <QuestionAndAnswer isShow={selectChat === 1} />
          <ChatOnWheat isShow={selectChat === 2} />
          <ChatInputBox {...props} />
        </React.Fragment>
      )}
    </div>
  );
};

const mapStateToProps = ({ chat, classroom, video }) => {
  return {
    selectChat: chat.selectChat,
    isClassBegin: classroom.isClassBegin,
    videoLen: video.studentStreamList.length + 1 // 学生视频长度 + 1个老师的视频
  };
};

const mapDispatchToProps = () => {
  return {
    setChatIndex: index => {
      Actions.setChatIndex(index);
      Actions.setPrivata({ selectUserID: '' });
    },
  };
};

// 连接组件
export default connect(mapStateToProps, mapDispatchToProps)(ChatBox);
