/* 聊天区-提示 */
import React from 'react';
import { YsGlobal } from '@global/handleGlobal';
const { chatTip } = YsGlobal.languageInfo.chat;
export default class ChatTip extends React.Component {
  render() {
    const { isToastTip } = this.props;
    return (
      <div className={`toast-tip${isToastTip ? '' : ' hide'}`}>
        <span className="icon icon-wraning"></span>
        {chatTip.iconWraning}
      </div>
    );
  }
}
