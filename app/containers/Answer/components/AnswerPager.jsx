import React from 'react';
import { Input } from '@components/Form';

import '../styles/AnswerPager.scss';

const AnswerPager = props => {
  const { pageNum, pageCount, detailPageChange } = props;
  const prev = () => {
    const num = pageNum - 1;
    if (num > -1) detailPageChange(num);
  };
  const next = () => {
    const num = pageNum + 1;
    if (num <= pageCount) detailPageChange(num);
  };
  const inputChange = num => {
    if (num <= pageCount) detailPageChange(num);
    else return pageCount;
    return num;
  };
  return (
    <div className="answer-pager">
      <span className="prev-btn" onClick={prev}></span>
      <Input type="number" value={pageNum} onChange={inputChange} />
      <span className="slash"> / </span>
      <div className="page-count">{pageCount}</div>
      <span className="next-btn" onClick={next}></span>
    </div>
  );
};
export default AnswerPager;
