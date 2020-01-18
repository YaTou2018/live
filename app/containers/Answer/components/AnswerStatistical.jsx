import React from 'react';
// import lang from '../language';

import '../styles/AnswerStatistical';

const AnswerStatistical = props => {
  const { options = {}, personCount } = props;

  return (
    <div className="answer-statistical">
      {Object.entries(options).map(([content, count]) => {
        return (
          <div className="answer-opt-item" key={`option_${content}`}>
            <div className="opt-text">{content}</div>
            <div className="opt-progress">
              <div className="opt-radio" style={{ width: `${(count ? count / personCount : 0) * 100}%` }}></div>
            </div>
            <div className="person-count">{count}&nbsp;</div>
          </div>
        );
      })}
    </div>
  );
};

export default AnswerStatistical;
