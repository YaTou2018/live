import React from 'react';
import lang from '../language';

import '../styles/AnswerDetail.scss';

const AnswerDetail = props => {
  const { details: detailInfo } = props;
  return (
    <div className="answer-detail">
      <div className="detail-list-head">
        <div className="nick-name">{lang.nickName}</div>
        <div className="selected-answer">{lang.selectAnswers}</div>
        <div className="detail-duration">{lang.duration}</div>
      </div>
      <ul className="detail-list-box">
        {detailInfo.map(detail => {
          return (
            <li className="detail-list-item" key={`detail_${detail.studentname}`}>
              <div className="nick-name">{detail.studentname}</div>
              <div className="selected-answer">{detail.selectOpts}</div>
              <div className="detail-duration">{detail.timestr}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default AnswerDetail;
