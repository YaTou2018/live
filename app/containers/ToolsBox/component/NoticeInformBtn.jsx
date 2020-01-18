import React from 'react';
import Actions from '@global/actions';
import { YsGlobal } from '@global/handleGlobal';
import Signalling from '../../../global/services/SignallingService';

const { toolsBoxInner } = YsGlobal.languageInfo;
const NoticeBoard = () => {
  /* 公告 */
  const liveNoticeInform = () => {
    Actions.changeModalMsg(
      {
        type: 'custom',
        title: toolsBoxInner.titleAnn,
        okBtn: toolsBoxInner.issue,
        customContent: {
          label: toolsBoxInner.customAnn,
          type: 'edit-textarea',
          warnMsg: toolsBoxInner.announcementWarnMsg,
        },
      },
      // eslint-disable-next-line consistent-return
      (answer, data) => {
        if (data) {
          if (!data.text.length) {
            return false;
          }
          if (answer && data.text) {
            if (data.text.replace(/\s/g, '').length < 1) {
              return false;
            }
            Signalling.sendSignallingToNoticeBoard(data);
          }
        }
      },
    );
  };

  return (
    <li onClick={liveNoticeInform}>
      <i className="icon-gonggao" />
      {toolsBoxInner.announcement}
    </li>
  );
};
export default NoticeBoard;
