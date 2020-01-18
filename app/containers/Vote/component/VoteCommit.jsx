import React, { Component } from 'react';
import { FormItem, RadioGroup, Radio, CheckboxGroup, Checkbox } from '@components/Form';
import Button from '@components/Button';
import { YsGlobal } from '@global/handleGlobal';

import Hoster from './Hoster';

import '../styles/voteCommit';

const { voteCom } = YsGlobal.languageInfo;
const { hosterInner } = voteCom;
export default class VoteCommit extends Component {
  constructor(props) {
    super();
    const { pattern, options, sendVoteTime, sendVoteUserName, subject, desc } = props.voteInfo;
    this.state = {
      pattern,
      options: options.map((option, index) => {
        const opt = option;
        if (!opt.id) opt.id = `option_${index}`;
        if (!opt.index) opt.index = index.toString();
        return opt;
      }),
      sendVoteTime,
      sendVoteUserName,
      subject,
      selecteds: [],
      desc,
    };
  }

  optionChange(selecteds) {
    this.setState({
      selecteds,
    });
  }

  submit() {
    const { submit } = this.props;
    const { selecteds, options } = this.state;
    const selectedOpts = selecteds instanceof Array ? selecteds : [selecteds];
    if (typeof submit === 'function') {
      submit(
        options.map(opt => {
          const option = opt;
          if (selectedOpts.includes(option.index)) option.checked = true;
          return option;
        }),
      );
    }
  }

  render() {
    const { options, pattern, sendVoteUserName, sendVoteTime, subject, desc } = this.state;

    return (
      <div className="vote-panel voting">
        <div>
          <Hoster sendVoteUserName={sendVoteUserName} sendVoteTime={sendVoteTime} pattern={pattern} subject={subject} desc={desc} />
          <div className="form-group voting">
            <FormItem>
              {pattern === 'multi' && (
                <CheckboxGroup name="voteOption" onChange={(...args) => this.optionChange(...args)}>
                  {options.map(option => (
                    <Checkbox className="sub-option-item" value={option.index} key={option.id}>
                      {option.content}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              )}
              {pattern === 'radio' && (
                <RadioGroup name="voteOption" onChange={(...args) => this.optionChange(...args)}>
                  {options.map(option => (
                    <Radio className="sub-option-item" value={option.index} key={option.id}>
                      {option.content}
                    </Radio>
                  ))}
                </RadioGroup>
              )}
            </FormItem>
          </div>
          <div className="pub-btns voting">
            <Button type="primary" onClick={(...args) => this.submit(...args)}>
              {hosterInner.submit}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
