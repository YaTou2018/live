import React from 'react';
import { YsGlobal } from '@global/handleGlobal';

const { chat } = YsGlobal.languageInfo;
const { question } = chat;

function QuestionItemTitle(props) {
  const { questionType, who, time } = props;
  return (
    <div className="QuestionItemTitle">
      <span className="question_name">{who}</span>
      <span className="question_time">{time}</span>
      {questionType === 'question' ? <span className="question_type question">{question.inspectStatus}</span> : null}
      {questionType === 'pass' ? <span className="question_type pass">{question.sendStatus}</span> : null}
      {questionType === 'answer' ? <span className="question_type answer">{question.answerStatus}</span> : null}
    </div>
  );
}

export default QuestionItemTitle;
