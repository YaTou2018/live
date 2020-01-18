import React from 'react';
import { liveRoom } from '@global/roomConstants';
import Actions from '@global/actions';
import { YsGlobal } from '@global/handleGlobal';
import UploadFileFrom from 'UploadFileFrom';
import { FileItemEvent } from '@containers/CourseList/service/service';
import { connect } from 'react-redux';
import WhiteboardService from '@global/services/WhiteboardService';

const invalidType = ['zip'];
class PhotoUpload extends React.Component {
  constructor() {
    super();
    this.state = {
      imgflag: 1,
    };
    this.size = 1 * 1024 * 1024; /* 上传图片默认参数 */
    this.accept = '.png,.gif,.jpg,.jpeg'; /* 上传图片默认参数 */
  }

  componentDidMount() {
    liveRoom.addEventListener('room-add-file', this.handlerRoomAddFile.bind(this), this.listernerBackupid); // 监听room事件：room-add-file
  }

  handlerRoomAddFile(receiveEventData) {
    // eslint-disable-next-line no-unused-vars
    const { fileid, fromID } = receiveEventData.message;
    const fileInfo = liveRoom.getFileinfo(fileid) || {};
    const fileList = [...this.props.fileList, fileInfo];
    this.props.sortFileList({ fileSortType: this.props.fileSortType, isAsc: this.props.isAsc });
    this.props.updateFileList(fileList);
    this.props.openDocument(fileInfo.file ? fileInfo : { file: fileInfo });
    WhiteboardService.getYsWhiteBoardManager().changeDocument(fileInfo.fileid, fileInfo.currpage);
  }

  uploadFile(formData, filename, filetype) {
    this.setState({
      imgflag: this.state.imgflag + 1,
    });
    if (invalidType.includes(filetype) && YsGlobal.roomInfo.isLiveRoom) {
      this.uploadCancel();
      return;
    }
    liveRoom.uploadFile(
      formData,
      // 上传状态
      code => {
        if (code !== 0) {
          FileItemEvent.fileUploadErrorCode(code);
        }
      },
    );
  }

  render() {
    const { imgflag } = this.state;
    return (
      <div>
        <div className="photoUpload">
          <div className="phototext">
            <UploadFileFrom isPhoto isWritedbFromUploadFile externalUploadFileCallback={this.uploadFile.bind(this)} accept={this.accept} flag={imgflag} />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  const { file } = state;
  return {
    fileList: file.fileList,
    fileSortType: file.fileSortType,
    isAsc: file.isAsc,
  };
};
const mapDispatchToProps = dispatch => ({
  sortFileList: data => dispatch(Actions.sortFileList(data)),
  openDocument: data => dispatch(Actions.openDocument(data)),
  updateFileList: data => dispatch(Actions.updateFileList(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(PhotoUpload);
