/**
 * @description 翻页组件
 */

import React from 'react';
const Pagitation = props => {
  const { pageSum, currentPage, changPage } = props;
  const handlerClickPrev = () => {
    if (currentPage <= 1) {
      return;
    }
    changPage(currentPage - 1);
  };
  const handlerClickNext = () => {
    if (currentPage >= pageSum) {
      return;
    }
    changPage(currentPage + 1);
  };
  return (
    <div className="paging-container">
      <span className="paging-left icon-left " onClick={handlerClickPrev}></span>
      <div className="paging-container-info">
        <span className="paging-sum">{currentPage}</span>/<span className="paging-sum">{pageSum || 1}</span>
      </div>
      <span className="paging-right icon-right" onClick={handlerClickNext}></span>
    </div>
  );
};

export default Pagitation;
