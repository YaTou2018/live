import React, { Component } from 'react';

import { FormItem, Input, Textarea, RadioGroup, Radio, CheckboxGroup, Checkbox } from '@components/Form';
import Toast from '@components/Toast';
import Button from '@components/Button';
import Actions from '@global/actions';
import '../styles/VotePubPanel';
import { YsGlobal } from '@global/handleGlobal';

const { voteCom } = YsGlobal.languageInfo;
const { pubpanerInner } = voteCom;

export default class VotePubPanel extends Component {
  state = {
    checkeds: undefined,
    voteInfo: {
      subject: '',
      desc: '',
      pattern: 'multi',
      options: [
        {
          index: '1',
          id: 'option_1',
          content: '',
          checked: false,
        },
      ],
    },
  };

  maxNumber = 24;

  /**
   * 修改当前表单的值
   * @param {String} field 修改的字段
   * @param {any} value 字段值
   */
  formChange(field, value) {
    const { voteInfo } = this.state;
    this.setState({
      voteInfo: {
        ...voteInfo,
        ...{
          [field]: field === 'desc' ? value && value.trimLeft() : value,
        },
      },
    });
  }

  patternChange(pattern) {
    const { voteInfo } = this.state;
    // 在修改完成选择模式后触发optionsChange方法修改form中投票选项字段的更新
    this.setState(
      {
        voteInfo: {
          ...voteInfo,
          ...{
            pattern,
          },
        },
      },
      () => this.optionsChange(pattern === 'multi' ? [] : ''),
    );
  }

  /* 投票选项相关操作 */
  addOption() {
    const { voteInfo } = this.state;
    const { options } = voteInfo;
    if (options.length >= 7) {
      Toast.error(pubpanerInner.maxOptions);
      return;
    }
    this.formChange('options', [
      ...options,
      {
        id: `option_${Number(options[options.length - 1].index) + 1}`,
        content: '',
        index: String(Number(options[options.length - 1].index) + 1),
        checked: false,
      },
    ]);
  }

  removeOption(e, id) {
    const { voteInfo } = this.state;
    const { options } = voteInfo;
    if (options.length <= 1) {
      Toast.error(pubpanerInner.least);
      e.stopPropagation();
      return;
    }
    this.formChange(
      'options',
      options.filter(option => option.id !== id),
    );
  }

  optionsChange(checkeds) {
    const { voteInfo } = this.state;
    const { options, pattern } = voteInfo;
    let opts = JSON.parse(JSON.stringify(options));
    opts = opts.map(opt => {
      const option = opt;
      if (pattern === 'multi') {
        option.checked = checkeds.includes(option.index);
      } else {
        option.checked = checkeds === option.index;
      }
      return option;
    });
    this.setState({
      checkeds,
    });
    this.formChange('options', opts);
  }

  optValChange(id, value) {
    const { voteInfo } = this.state;
    const { options } = voteInfo;
    let opts = JSON.parse(JSON.stringify(options));
    opts = opts.map(opt => {
      const option = opt;
      if (option.id === id) {
        option.content = value;
      }
      return option;
    });
    this.formChange('options', opts);
  }
  /* End 投票选项相关操作 */

  /* 取消，保存，发布操作 */
  pubVote() {
    if (!this.verify()) return;
    const { pub } = this.props;
    if (typeof pub === 'function') {
      pub(this.state.voteInfo);
    }
  }

  cancel() {
    const { cancel } = this.props;
    if (typeof cancel === 'function') cancel();
  }

  verify(showAlert = true) {
    const { subject, desc, options } = this.state.voteInfo;
    if (!(subject && desc && options.length && !options.filter(opt => !opt.content.trimLeft()).length)) {
      // eslint-disable-next-line
      showAlert && Toast.error(pubpanerInner.voteMsg);
      return false;
    }
    return true;
  }

  render() {
    const {
      checkeds,
      voteInfo: { options, pattern },
    } = this.state;

    return (
      <div className="vote-panel">
        <div className="form-group">
          <FormItem label={pubpanerInner.theme}>
            <Input maxLength={this.maxNumber} placeholder={voteCom.maxNumber} name="subject" onChange={(...agrs) => this.formChange('subject', ...agrs)} />
          </FormItem>
          <FormItem label={pubpanerInner.voteDetail}>
            <Textarea maxLength={this.maxNumber} placeholder={voteCom.maxNumber} name="desc" onChange={(...agrs) => this.formChange('desc', ...agrs)} />
          </FormItem>
          <FormItem label={pubpanerInner.chooseType}>
            <RadioGroup name="votePattern" value={pattern} onChange={(...agrs) => this.patternChange(...agrs)}>
              <Radio className="pattern-item" value="radio" key="option_radio">
                {pubpanerInner.choseOne}
              </Radio>
              <Radio className="pattern-item" value="multi" key="option_checkbox">
                {pubpanerInner.multiple}
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label={pubpanerInner.option}>
            {pattern === 'multi' && (
              <CheckboxGroup name="voteOption" value={checkeds} onChange={(...agrs) => this.optionsChange(...agrs)}>
                {options.map(option => (
                  <Checkbox className="option-item" value={option.index} key={option.id}>
                    <Input
                      maxLength={this.maxNumber}
                      placeholder={voteCom.maxNumber}
                      defaultValue={option.content}
                      onChange={(...agrs) => this.optValChange(option.id, ...agrs)}
                    />
                    <span className="rmv-icon" onClick={event => this.removeOption(event, option.id)} />
                  </Checkbox>
                ))}
              </CheckboxGroup>
            )}
            {pattern === 'radio' && (
              <RadioGroup name="voteOption" value={checkeds} onChange={(...agrs) => this.optionsChange(...agrs)}>
                {options.map(option => (
                  <Radio className="option-item" value={option.index} key={option.id}>
                    <Input
                      maxLength={this.maxNumber}
                      placeholder={voteCom.maxNumber}
                      defaultValue={option.content}
                      onChange={(...agrs) => this.optValChange(option.id, ...agrs)}
                    />
                    <span className="rmv-icon" onClick={event => this.removeOption(event, option.id)} />
                  </Radio>
                ))}
              </RadioGroup>
            )}
          </FormItem>
        </div>
        <div className="add-options">
          <span>{pubpanerInner.trueChoose}</span>
          <span className="add-opt-btn" onClick={() => this.addOption()} />
        </div>
        <div className="pub-btns">
          <Button onClick={(...agrs) => this.cancel(...agrs)}>{pubpanerInner.cancel}</Button>
          {this.verify(false) ? (
            <Button type="primary" onClick={(...agrs) => this.pubVote(...agrs)}>
              {pubpanerInner.submit}
            </Button>
          ) : (
            <Button
              onClick={() => {
                Actions.changeModalMsg({
                  type: 'alert',
                  message: pubpanerInner.voteMsg,
                });
              }}
            >
              {pubpanerInner.submit}
            </Button>
          )}
        </div>
      </div>
    );
  }
}
