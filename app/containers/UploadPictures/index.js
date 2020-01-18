import React, { Component } from 'react';
import './static/sass/index.scss';
import { YsGlobal } from '@global/handleGlobal';
import FetchService from '@global/services/FetchService';
import { connect } from 'react-redux';
import Actions from '@global/actions';
import Signalling from '@global/services/SignallingService';
import { liveRoom } from '@global/roomConstants';
import { getGUID } from '../../utils/ysUtils';

const { toUpdata } = YsGlobal.languageInfo;

const QRCode = require('qrcode.react');
class QrCodeTeachingToolSmart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qrcodeValue: '',
    };
    this.interval = null;
  }

  componentDidMount() {
    this.pageOpenFn();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  pageOpenFn() {
    const that = this;
    const { id, nickname } = liveRoom.getMySelf();
    const { companyid, serial } = liveRoom.getRoomProperties();

    const userName = encodeURI(nickname);
    const codeid = `${id}_${getGUID().getGUIDDate()}${getGUID().getGUIDTime()}`;

    const urldata = `https://rddoccdndemows.roadofcloud.com:443/static/qrCode/qrCode.html?serial=${serial}&userid=${id}&sender=${userName}&key=${companyid}&url=${
      YsGlobal.serviceInfo.webRequest
    }&languageName=${YsGlobal.languageName}&ts=${new Date().getTime()}&codeid=${codeid}`;

    this.setState({
      qrcodeValue: urldata,
    });

    const data = {
      key: companyid,
      serial,
      uploaduserid: id,
      codeid,
      codetype: 1,
      handlerEventKey: 'getQrCodeUploadFile',
      remark: toUpdata.getTwo,
    };
    const url = `${YsGlobal.serviceInfo.webRequest}/ClientAPI/getUploadfile?ts=${new Date().getTime()}`;
    this.interval = setInterval(() => {
      FetchService.upLoadPic(url, data).then(res => {
        if (res.result !== -1) {
          const isItemKey = that.props.fileList.find(it => it.filename === res.filename);
          if (!isItemKey) {
            // 新模板派发信令
            const isDynamicPPT = res.fileprop === 1 || res.fileprop === 2;
            const isH5Document = res.fileprop === 3;
            const isGeneralFile = !isDynamicPPT && !isH5Document;
            const isMediaFile = /(mp3|mp4|webm)/g.test(res.filetype);
            const fileInfoObj = {
              isDel: false,
              isGeneralFile,
              isMedia: isMediaFile,
              isDynamicPPT,
              isH5Document,
              action: '',
              mediaType: isMediaFile ? res.filetype : '',
              filedata: {
                fileid: Number(res.fileid),
                currpage: 1,
                pagenum: Number(res.pagenum),
                filetype: res.filetype,
                filename: res.filename,
                swfpath: isDynamicPPT || isH5Document ? res.downloadpath : res.swfpath,
                pptslide: 1,
                pptstep: 0,
                steptotal: 0,
                filecategory: res.filecategory !== undefined ? Number(res.filecategory) : 0, // 0:课堂 ， 1：系统
              },
            };
            Signalling.sendSignallingFromDocumentChange(fileInfoObj);
            that.props.changeUpdatapic(false);
          }
        }
      });
    }, 3000);
  }

  closeUpDataPictureBox() {
    this.props.changeUpdatapic(false);
  }

  render() {
    const { qrcodeValue } = this.state;
    return (
      <div className="upLoadBox">
        <div className="qrCode-teachTool-header">
          <div>{toUpdata.smToLoadPic}</div>
          <span className="icon-del qrCode-close" onClick={this.closeUpDataPictureBox.bind(this)}></span>
        </div>
        <div className="upLoadBox_container">
          <div className="qrcode">
            <QRCode className="canvasInner" value={qrcodeValue} style={{ height: '2.6rem', width: '2.6rem' }} level="L"></QRCode>
          </div>
          <div className="picture_wrong">{toUpdata.uploadWrong}</div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  fileList: state.file.fileList,
});
const mapDispatchToProps = dispatch => ({
  sortFileList: data => dispatch(Actions.sortFileList(data)),
  openDocument: data => dispatch(Actions.openDocument(data)),
  setFileList: data => dispatch(Actions.setFileList(data)),
  updateFileList: data => dispatch(Actions.updateFileList(data)),
  changeUpdatapic: data => Actions.updataPicCount(data),
});

export default connect(mapStateToProps, mapDispatchToProps)(QrCodeTeachingToolSmart);
