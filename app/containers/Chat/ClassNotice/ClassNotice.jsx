import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { YsGlobal } from '@global/handleGlobal';
import Notification from '@containers/Notification/Notification';
import RemindMsg from '../ChatContainer/remindMsg';
import { getNowDate } from '../utils';

import { setChatNoticeBoard } from '../state/actions';

const { header } = YsGlobal.languageInfo;

const ClassNotice = props => {
  const {
    // 公告内容
    liveNoticeBoard,
    // 关闭公告
    remindClose,
  } = props;
  const { roomName, serial } = YsGlobal.roomInfo;

  return (
    <div className="class-notice">
      <div style={{ padding: '12px' }}>
        <p className="classRoomDate">{getNowDate()}</p>
        <div className="class-info">
          <div className="class_room_icon"></div>
          <div className="class-notice-time">
            <p>{header.roomNoLanguage}：{serial}</p>
            <p>{header.roomName}：{roomName}</p>
          </div>
        </div>
        <div className="class-notice-board">
          <div className="notice_msg_box">
            {liveNoticeBoard && <RemindMsg test={liveNoticeBoard} remindClose={remindClose} />}
            <Notification />
          </div>
        </div>
      </div>
    </div>
  );
};

ClassNotice.propTypes = {};

// 需要渲染什么数据
function mapStateToProps({ chat }) {
  return {
    liveNoticeBoard: chat.liveNoticeBoard,
  };
}
// 需要触发什么行为
function mapDispatchToProps(dispatch) {
  return {
    remindClose: () => {
      dispatch(setChatNoticeBoard(''));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClassNotice);
