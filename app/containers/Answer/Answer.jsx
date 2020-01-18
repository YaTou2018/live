import React from 'react';
import { connect } from 'react-redux';
import { liveRoom } from '@global/roomConstants';
import { Checkbox } from '@components/Form';
import Actions from '@global/actions';
import lang from './language';
import AnswerService from './AnswerService';

import AnswerCreater from './components/AnswerCreater';
import AnswerDetail from './components/AnswerDetail';
import AnswerStatistical from './components/AnswerStatistical';
// import AnswerPager from './components/AnswerPager';
import AnswerStudent from './components/AnswerStudent';

import './Answer.scss';

const service = new AnswerService();

class Answer extends React.PureComponent {
  state = {
    isCheckedPubResult: false,
    currPanel: 'statistical', // detail: 显示答题详情, statistical: 统计
    page: 1,
  };

  user = liveRoom.getMySelf();

  detailPageChange(page) {
    this.setState(
      {
        page,
      },
      () => {
        service.startGetDetail(page);
      },
    );
  }

  publishChange(isCheckedPubResult) {
    this.setState({
      isCheckedPubResult,
    });
  }

  studentCommit(data, opts, isUpdate) {
    service.studentCommit(
      data,
      opts.reduce((prev, curr) => ({ ...(prev || {}), ...curr })),
      isUpdate,
    );
  }

  async panelChange(currPanel) {
    if (currPanel === 'detail') {
      await service.startGetDetail(this.state.page);
    } else {
      service.stopGetDetail();
    }
    this.setState({
      currPanel,
    });
  }

  pubAnswer(options) {
    service.pubAnswer({
      options,
    });
  }

  stopAnswer() {
    service.stopAnswer(this.state.isCheckedPubResult);
  }

  reStart() {
    service.reStart();
  }

  render() {
    const { isCheckedPubResult, currPanel } = this.state;
    const { answerState, answerData } = this.props;
    const {
      options = [],
      selecteds = {},
      duration = '00:00:00',
      detailData = [],
      isPublicResult,
      detailPageInfo = {},
      totalUsers = 0,
      myAnswers = [],
      commitedAnswer,
    } = JSON.parse(answerData);
    const rightAnswers = options.filter(opt => opt.isRight).map(opt => opt.content);
    return (
      <div className="answer">
        <div className="answer-header">
          {lang.title}
          {[0, 1].includes(this.user.role) || (![0, 1].includes(this.user.role) && answerState === 'stoped') ? (
            <span className="answer-close" onClick={() => service.close()}>
              ×
            </span>
          ) : (
            ''
          )}
        </div>
        <div className="answer-container">
          <div className="answer-info">
            {['answer', 'stoped'].includes(answerState) && [
              <div className="answer-persons" key="answerPerson">
                {lang.answerPersons}: {totalUsers}
              </div>,
              <div className="answer-duration" key="answerDuration">
                {lang.duration}: {duration}
              </div>,
            ]}
            {['answer', 'stoped'].includes(answerState) &&
              (currPanel === 'statistical' ? (
                <span className="btn panel-state-btn" onClick={this.panelChange.bind(this, 'detail')}>
                  {lang.btns.detail}
                </span>
              ) : (
                <span className="btn panel-state-btn" onClick={this.panelChange.bind(this, 'statistical')}>
                  {lang.btns.statistical}
                </span>
              ))}
          </div>
          {answerState === 'creating' && <AnswerCreater pubAnswer={this.pubAnswer.bind(this)} />}
          {['answer', 'stoped'].includes(answerState) &&
            (currPanel === 'statistical' ? (
              <AnswerStatistical personCount={totalUsers} options={selecteds} />
            ) : (
              <AnswerDetail page={detailPageInfo.current} details={detailData} />
            ))}
          {answerState === 'answerSelecting' && <AnswerStudent commitedAnswer={commitedAnswer} options={options} commit={this.studentCommit.bind(this)} />}
        </div>
        <div className="answer-footer">
          {/* {['answer', 'stoped'].includes(answerState) && currPanel === 'detail' && ( */}
          {/*  <AnswerPager pageNum={detailPageInfo.current} pageCount={detailPageInfo.total} detailPageChange={this.detailPageChange.bind(this)} /> */}
          {/* )} */}
          <div className="answers-info">
            {([0, 1].includes(this.user.role) ? ['answer', 'stoped'].includes(answerState) : answerState === 'stoped' && isPublicResult) && (
              <span>
                {lang.rightAnswers}: {rightAnswers.join(', ')}
              </span>
            )}
            {answerState === 'stoped' && currPanel === 'statistical' && ![0, 1].includes(this.user.role) && (
              <span>
                {lang.myAnswer}: {myAnswers}
              </span>
            )}
          </div>
          {[0, 1].includes(this.user.role) && answerState === 'answer' && currPanel !== 'detail' && (
            <Checkbox checked={isCheckedPubResult} className="publish-checkbox" onChange={this.publishChange.bind(this)}>
              {lang.btns.publishAnswer}
            </Checkbox>
          )}
          {[0, 1].includes(this.user.role) && answerState === 'stoped' && (
            <span className="btn restart-btn" onClick={this.reStart.bind(this)}>
              {lang.btns.reStart}
            </span>
          )}
          {[0, 1].includes(this.user.role) && answerState === 'answer' && currPanel !== 'detail' && (
            <span className="btn stop-btn" onClick={this.stopAnswer.bind(this)}>
              {lang.btns.stop}
            </span>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ Modules, classroom }) => ({
  studentCount: classroom.studentCount,
  answerState: Modules.answer.answerState,
  answerData: JSON.stringify(Modules.answer.answerData),
});

const mapDispatchToProps = () => ({
  setModuleStatus: status => {
    Actions.setModuleStatus('answer', status);
  },
  setModuleData: data => {
    Actions.setModuleData('answer', data);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Answer);
