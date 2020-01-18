import React from 'react';
import Actions from '@global/actions';
import { liveRoom } from '@global/roomConstants';
import { YsGlobal } from '@global/handleGlobal';

const { toolsBoxInner } = YsGlobal.languageInfo;
const ShareBtn = () => {
  return (
    <li
      onClick={() => {
        liveRoom.stopShareMedia();
        liveRoom.startShareScreen(null, code => {
          if (code === window.YS_ERR.CHECK_USERDesktopMediaError) {
            Actions.setModuleStatus('share', 'show');
          }
        });
      }}
    >
      <i className="iconfont icon-share" />
      {toolsBoxInner.share}
    </li>
  );
};
export default ShareBtn;
