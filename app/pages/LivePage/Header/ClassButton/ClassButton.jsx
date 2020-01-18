import React from 'react';
import { YsGlobal } from '@global/handleGlobal';
import Actions from '@global/actions';
import './classButton.scss';
import './iconfont/style.scss';
import FetchService from '../../../../global/services/FetchService';
const {
  pagesText: { classRoomMsg, classButton },
} = YsGlobal.languageInfo;
const ClassButton = props => {
  const { isClassBegin } = props;

  const classBtnClick = () => {
    if (!isClassBegin) {
      FetchService.roomStart();
    } else {
      Actions.changeModalMsg(
        {
          type: 'comfirm',
          title: classRoomMsg.confirm,
          okBtn: classButton.confirm,
          cancleBtn: classButton.cancel,
          message: classRoomMsg.confirmEnd,
        },
        answer => {
          if (answer) {
            FetchService.roomOver();
          }
        },
      );
    }
  };
  return (
    <button onClick={classBtnClick} className="class-btn">
      {classButton[isClassBegin ? 'endLive' : 'beginLive']}
    </button>
  );
};

export default ClassButton;
