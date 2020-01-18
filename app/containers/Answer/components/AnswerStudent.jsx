import React, { useState } from 'react';
import lang from '../language';

import '../styles/AnswerCreater';

const AnswerStudent = props => {
  const { options: propsOpts, commit, commitedAnswer = {} } = props;
  let initCommited = false;
  const options = propsOpts.map(({ content }) => {
    const opt = { content, isRight: false };
    if ((commitedAnswer.options || {})[content] === 1) {
      initCommited = true;
      opt.isRight = true;
    }
    return opt;
  });
  const [opts, updateOpts] = useState(options);
  const [commited, updateCommitState] = useState(initCommited);
  const [commitCount, updateCommitCount] = useState(0);
  const [oldOpts, updateOldOpts] = useState(commitedAnswer.options ? options : []);

  const changeOptStatus = content => {
    if (commited) return;
    updateOpts(
      opts.map(opt => {
        return { ...opt, isRight: opt.content === content ? !opt.isRight : opt.isRight };
      }),
    );
  };

  const commitOpts = () => {
    if (commited) {
      updateOpts(propsOpts.map(opt => ({ content: opt.content, isRight: false })));
      updateCommitState(!commited);
      return;
    }
    const updateMinus = opts
      .filter(opt => !opt.isRight && oldOpts.findIndex(option => option.content === opt.content && option.isRight) !== -1)
      .map(opt => ({ [opt.content]: -1 }));
    const updateZero = opts
      .filter(opt => opt.isRight && oldOpts.findIndex(option => option.content === opt.content && option.isRight) !== -1)
      .map(opt => ({ [opt.content]: 0 }));
    const updateAdd = opts.filter(opt => opt.isRight).map(opt => ({ [opt.content]: 1 }));
    if (updateAdd.length < 1) {
      alert('请至少选择一个选项');
      return;
    }
    commit(
      opts
        .filter(opt => opt.isRight)
        .map(opt => opt.content)
        .join(','),
      [...updateAdd, ...updateMinus, ...updateZero],
      commitCount !== 0,
    );
    updateOldOpts(opts);
    updateCommitCount(commitCount + 1);
    updateCommitState(!commited);
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
        <span className="btn answer-commit-btn" onClick={commitOpts}>
          {commited ? lang.btns.updateCommit : lang.btns.commit}
        </span>
      </div>
    </div>
  );
};

export default AnswerStudent;
