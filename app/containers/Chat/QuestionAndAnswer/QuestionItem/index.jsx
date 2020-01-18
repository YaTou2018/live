import React, { useEffect } from 'react';
import { liveRoom } from '@global/roomConstants';
import QuestionItemTitle from './QuestionItemTitle';
import QuestionItemText from './QuestionItemText';
import QuestionItemButton from './QuestionItemButton';

function QuestionItem(props) {
  const { role } = liveRoom.getMySelf();

  useEffect(() => {
    liveRoom.dispatchEvent({ type: 'chatScrollChange' });
  });

  const { msgObj } = props;
  const { filterQuestion } = props;
  return (
    <li
      className="QuestionItem"
      style={{
        display: filterQuestion === 'none' || filterQuestion === msgObj.fromID || filterQuestion === msgObj.toUserID ? '' : 'none',
      }}
    >
      <QuestionItemTitle questionType={msgObj.questionType} who={msgObj.who} time={msgObj.time} />
      <QuestionItemText questionType={msgObj.questionType} questionMsg={msgObj.questionMsg} answerMsg={msgObj.answerMsg} />
      {/* 只有老师和助教有操作权限 */}
      {role === 0 || role === 1 ? <QuestionItemButton msgObj={msgObj} /> : null}
    </li>
  );
}

export default QuestionItem;
