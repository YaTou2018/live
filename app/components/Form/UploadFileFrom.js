/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react/no-array-index-key */
/* eslint-disable prettier/prettier */
/* eslint-disable guard-for-in */
import React, { Component } from 'react';
import { L, liveRoom } from '@global/roomConstants';
import Actions from '@global/actions';
import { YsGlobal } from '@global/handleGlobal';

export default class UploadFileFrom extends Component {
  constructor() {
    super();
    this.state = {
      uploadFileParams: null,
    };
    this.isNeedUpload = false;
    this.uploadBtnType = false;
  }

  componentDidUpdate(prevProps) {

    if (prevProps.flag !== this.props.flag) {
      const input = this.i;
      input.value = '';
      input.click();
    }
    if (this.isNeedUpload) {
      this.isNeedUpload = false;
      const formData = new FormData(this.form);

      if (
        this.props.externalUploadFileCallback &&
        typeof this.props.externalUploadFileCallback === 'function' &&
        this.state.uploadFileParams
      ) {
        this.props.externalUploadFileCallback(
          formData,
          this.state.uploadFileParams.fileoldname,
          this.state.uploadFileParams.filetype,
        );
      } else {
        liveRoom.uploadFile(formData, (code, res) => {
          if (code === 0) {
            this.props.uploadSuccessCallback(res);
          } else {
            L.Logger.warning('服务端失败');
          }
        });
      }
    }
    /* this.props.file(this.i,this.form) */
  }

  change(e) {
    const input = this.i;
    // eslint-disable-next-line prefer-destructuring
    const accept = this.props.accept;
    const uploadFileName = input.files[0].name;
    const fileType = uploadFileName.substring(
      uploadFileName.lastIndexOf('.') + 1,
    ).toLowerCase();
    const acceptFileTyle = `${accept.toString()}`;
    if (
      acceptFileTyle.toLowerCase().indexOf(`.${fileType}`) === -1
    ) {
      Actions.changeModalMsg({
        type: 'alert',
        message: `文件类型错误，不支持文件类型为'.${fileType}的文件！`,
      });
      return;
    }
    if (this.props.size) {
      const MAXFILESIZE = this.props.size;
      const fileSize = input.files[0].size;
      if (fileSize > MAXFILESIZE) {
        Actions.changeModalMsg({
          type: 'alert',
          message: `文件大小超过限制，文件大小不能超过${MAXFILESIZE /
            1024 /
            1024}M`,
        });
        return;
      }
    }

    const uploadFileParams = liveRoom.getUploadFileParams(
      uploadFileName,
      fileType,
      this.props.isWritedbFromUploadFile !== undefined
        ? this.props.isWritedbFromUploadFile
        : false,
    );

      uploadFileParams.dynamicppt = ['ppt', 'pptx'].includes(fileType) && this.props.uploadType=== 'fewUpload'? 1 : 0;
    this.isNeedUpload = true;
    this.setState({
      uploadFileParams,
    });
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const ary = [];
    for (const i in this.state.uploadFileParams) {
      ary.push({ [i]: this.state.uploadFileParams[i] });
    }

    /* todu */
    const testGlobal = {
      isClient: false,
      osType: false,
    };

    const { isPhoto } = this.props;
    return (
      <div>
        <form
          style={{ display:isPhoto? 'block' : 'none' }}
          ref={form => {
            this.form = form;
          }}
        >
          {YsGlobal.isSafari?<input
            type="file"
            ref={i => {
              this.i = i;
            }}
            onChange={this.change.bind(this)}
            name="filedata"
            accept="image/*"
            className={isPhoto?'photoImg':''}
          />:<input
            type="file"
            ref={i => {
              this.i = i;
            }}
            onChange={this.change.bind(this)}
            name="filedata"
            // eslint-disable-next-line no-nested-ternary
            accept={isPhoto?"image/*" : testGlobal.isClient || testGlobal.osType === 'Mac'
            ? '*'
            : this.props.accept
              
            }
            className={isPhoto?'photoImg':''}
            capture="camera"
          />}
          {ary.length > 0
            ? ary.map((item, index) => {
              let key;
              let value;
              for (const a in item) {
                key = a;
                value = item[a];
              }
              return (
                <input
                  type="text"
                  key={index}
                  name={key}
                  value={value}
                  readOnly
                />
              );
            })
            : null}
        </form>
      </div>
    );
  }
}
