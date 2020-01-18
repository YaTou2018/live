import React, { useState } from 'react';
import lang from '../language';

import '../styles/AnswerCreater';

const AnswerCreater = props => {
  const [opts, updateOpts] = useState([
    {
      content: 'A',
      isRight: false,
    },
    {
      content: 'B',
      isRight: false,
    },
    {
      content: 'C',
      isRight: false,
    },
    {
      content: 'D',
      isRight: false,
    },
  ]);

  const changeOptStatus = content => {
    updateOpts(
      opts.map(opt => {
        return { ...opt, isRight: opt.content === content ? !opt.isRight : opt.isRight };
      }),
    );
  };

  const addOpt = () => {
    if (opts.length >= 8) return;
    const optTexts = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    updateOpts([...opts, { content: optTexts[opts.length], isRight: false }]);
  };

  const rmvOpt = () => {
    if (opts.length < 3) return;
    updateOpts(opts.slice(0, opts.length - 1));
  };

  const pub = () => {
    const { pubAnswer } = props;
    if (typeof pubAnswer === 'function') {
      pubAnswer(opts);
    }
  };

  return (
    <div className="answer-creater">
      <div className="creater-opts">
        {opts.map(opt => (
          <div className={`create-opt-item ${opt.isRight ? 'selected' : ''}`} onClick={() => changeOptStatus(opt.content)} key={`optItem_${opt.content}`}>
            {opt.content}
          </div>
        ))}
      </div>
      <div className="btns">
        <span className="btn opt-add-btn" onClick={addOpt}>
          {lang.btns.addAnswer}
        </span>
        <span className="btn opt-rmv-btn" onClick={rmvOpt}>
          {lang.btns.rmvAnswer}
        </span>
      </div>
      <div className="right-opt-desc">{lang.setRightAnswer}</div>
      <span className="btn pub-btn" onClick={pub}>
        {lang.btns.pubAnswer}
      </span>
    </div>
  );
};

export default AnswerCreater;
