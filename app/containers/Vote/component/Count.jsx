import React from 'react';

const Count = props => {
  const { options, count } = props;

  return (
    <ul className="result-list vote-scrollBar voting-res">
      {options.map(option => (
        <li className="option-res" key={option.content}>
          <div className="percent-text">{option.content}</div>
          <div className="percent-bottom">
            <div className="percent-all">
              <div className="percent" style={{ width: `${Math.min((option.count / count) * 100, 100)}%` }}></div>
            </div>
            <div className="percent-count">{option.count}人</div>
          </div>
        </li>
      ))}
    </ul>
  );
};
export default Count;
