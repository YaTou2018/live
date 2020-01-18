import React, { Component } from 'react';
import { connect } from 'react-redux';
import questionsListener from './QuestionsListener';
import ChatListWarp from '../components/ChatListWarp';
import QuestionItem from './QuestionItem';
import SystemMsgItem from './QuestionItem/SystemMsgItem';

class QuestionMsgList extends Component {
  listernerBackupid = new Date().getTime();

  componentWillUnmount() {
    questionsListener.removeBackupListerner();
  }

  render() {
    const { isShow } = this.props;
    // 提问排序数组
    const { questionListArr } = this.props;
    const { questionListObj } = this.props;
    // 筛选条件
    const { filterQuestion } = this.props;
    return (
      <ChatListWarp isShow={isShow} classNames="QuestionList">
        <ul className="QuestionMsgList">
          {questionListArr.map(item => {
            const msgObj = questionListObj[item];
            if (msgObj.msgtype === 'text') {
              return <QuestionItem key={item} msgObj={msgObj} filterQuestion={filterQuestion} />;
            }
            if (msgObj.msgtype === 'systemMsg' || msgObj.msgtype === 'notice') {
              return <SystemMsgItem key={item} msgObj={msgObj} />;
            }
          })}
        </ul>
      </ChatListWarp>
    );
  }
}

// 需要渲染什么数据
function mapStateToProps({ chat }) {
  return {
    questionListArr: chat.questionListArr,
    questionListObj: chat.questionListObj,
    filterQuestion: chat.filterQuestion,
  };
}
// 需要触发什么行为
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionMsgList);
