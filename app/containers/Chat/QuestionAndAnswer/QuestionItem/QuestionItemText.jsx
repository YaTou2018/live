import React, { useState } from 'react';
import { YsGlobal } from '@global/handleGlobal';
import { emoticonToNull } from '../../utils';
import { translateAjax } from '../../service/ajax';
function QuestionItemText(props) {
  const { chat } = YsGlobal.languageInfo;
  const { question } = chat;
  const [strmsgToLanguage, setStrmsgToLanguage] = useState('');
  const [answer, setAnswer] = useState(null);

  const translateFn = () => {
    translateAjax(emoticonToNull(questionMsg))
      .then(res => {
        if (!res.strmsgToLanguage.length) return;
        setStrmsgToLanguage(res.strmsgToLanguage);
      })
      .catch(err => {
        console.warn(err);
      });
  };
  const translateFn2 = () => {
    translateAjax(emoticonToNull(answerMsg))
      .then(res => {
        if (!res.strmsgToLanguage.length) return;
        setAnswer(res.strmsgToLanguage);
      })
      .catch(err => {
        console.warn(err);
      });
  };
  const { questionType, questionMsg, answerMsg } = props;
  const questionTextInner = questionType === 'answer' ? answerMsg : questionMsg;

  return (
    <div className="QuestionItemText">
      <p className="to_answer">
        <span> {questionTextInner}</span>
        {['question', 'pass'].includes(questionType) ? (
          <span className="icon icon-fanyi" onClick={translateFn} />
        ) : (
          <span className="icon icon-fanyi" onClick={translateFn2} />
        )}
      </p>
      {answer ? <span className="remind-msg-innerHTML">{answer}</span> : null}
      {['question', 'pass'].includes(questionType) && strmsgToLanguage ? <span className="remind-msg-innerHTML">{strmsgToLanguage}</span> : null}
      {questionType === ('answer' || 'pass') ? (
        <p className="to_question">
          <span className="icon icon-fanyi" onClick={translateFn} />
          <span className="question_inner">
            {question.sendStatus}: {questionMsg}
            {strmsgToLanguage ? <span className="remind-msg-innerHTML">{strmsgToLanguage}</span> : null}
          </span>
        </p>
      ) : null}
    </div>
  );
}

export default QuestionItemText;
