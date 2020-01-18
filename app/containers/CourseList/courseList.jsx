/* eslint-disable no-case-declarations */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/**
 * @description 课件库
 * @author mlh
 * @date 2018/12/9
 */

import React from 'react';
import { connect } from 'react-redux';
import { liveRoom } from '@global/roomConstants';
import { YsGlobal } from '@global/handleGlobal';

import WhiteboardService from '@global/services/WhiteboardService';
import globalActions from '@global/actions';
import Actions from './actions';
import { FileItemEvent } from './service/service';

import FileToolBar from './components/fileListHasToolBar';

import './static/sass/index.scss';
// const { isLiveRoom } = YsGlobal.roomInfo;
const {
  courseList: { fileProgressBarInner },
} = YsGlobal.languageInfo;
class CourseList extends React.Component {
  constructor(props) {
    super(props);
    this.listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
    this.whiteBoard = FileItemEvent.addWhiteBoardInfo();
    this.handleSort = this.handleSort.bind(this);
    this.deleteFileLiveRoom = this.deleteFileLiveRoom.bind(this);
  }

  componentDidMount() {
    liveRoom.addEventListener('room-add-file', this.handlerRoomAddFile.bind(this), this.listernerBackupid); // 监听room事件：room-add-file
    liveRoom.addEventListener('room-delete-file', this.handlerRoomDeleteFile.bind(this), this.listernerBackupid); // 监听room事件：room-delete-file
    liveRoom.addEventListener('receiveWhiteboardSDKAction', this.receiveWhiteboardSDKAction.bind(this), this.listernerBackupid); // 监听room事件：room-delete-file
  }

  componentWillUnmount() {
    liveRoom.removeBackupListerner(this.listernerBackupid);
  }

  handlerRoomAddFile(receiveEventData) {
    const { fileid, fromID } = receiveEventData.message;
    const fileInfo = liveRoom.getFileinfo(fileid) || {};
    const fileList = [...this.props.fileList, fileInfo];
    this.props.sortFileList({ fileSortType: this.props.fileSortType, isAsc: this.props.isAsc });
    this.props.updateFileList(fileList);
    if (!fileInfo.dynamicppt) {
      this.props.openDocument(fileInfo.file ? fileInfo : { file: fileInfo });
      if (fromID === liveRoom.getMySelf().id) {
        WhiteboardService.getYsWhiteBoardManager().changeDocument(fileInfo.fileid, fileInfo.currpage);
      }
    }
  }

  handlerRoomDeleteFile(receiveEventData) {
    const { fileid, fromID } = receiveEventData.message;
    const oldFileList = this.props.fileList;
    const fileList = oldFileList.filter(fileItem => fileItem.fileid !== fileid);
    // 如果当前删除的是教室课件 ，并且当前文件选中状态，那么更新白板
    if (fileid === this.props.selectedFileID && (!liveRoom.getUser(fromID) || fromID === liveRoom.getMySelf().id)) {
      // 只有自己删除的文件才能发送切换文档的消息

      const fileIndex = oldFileList.findIndex(fileData => fileData.fileid === fileid);
      // 展示上一个文件
      if (fileIndex > 0) {
        this.props.openDocument({ file: oldFileList[fileIndex - 1] });
        WhiteboardService.getYsWhiteBoardManager().changeDocument(oldFileList[fileIndex - 1].fileid, oldFileList[fileIndex - 1].currpage);
      } else if (fileIndex === 0) {
        this.props.openDocument({ file: this._getFiles(0).file });
        WhiteboardService.getYsWhiteBoardManager().changeDocument(this._getFiles(0).file.fileid, this._getFiles(0).file.currpage);
      }
    }
    this.props.updateFileList([].concat(fileList));
  }

  /**
   * 处理白板sdk返回的数据
   * @params {sting} action 动作
   * @params {object} cmd 当前动作携带的数据
   */
  receiveWhiteboardSDKAction(recvEventData) {
    const { action, cmd = {} } = recvEventData.message;
    switch (action) {
      case 'viewStateUpdate':
        const { viewState } = cmd;
        const { fileid, page } = viewState;
        const { file, fileList } = this._getFiles(fileid, page);
        if (file) {
          this.props.updateFileList(fileList);
          if (fileid !== this.props.selectedFileID) {
            if (file.filetype === 'mp3' || file.filetype === 'mp4') {
              return;
            }

            this.props.openDocument({ file });
          }
        }
        break;
      case 'mediaPlayerNotice':
        const mediaId = cmd.fileid;
        if (cmd.type === 'play') {
          if (this._getFiles(mediaId).file) {
            this.props.openDocument({
              mediaStatus: cmd.type,
              file: this._getFiles(mediaId).file,
            });
          }
        } else if (cmd.type === 'end') {
          if (`${this.props.selectedFileID}` === `${this.props.HistoryFileId.course}`) return;
          if (this.props.HistoryFileId.course || this.props.HistoryFileId.course === 0) {
            this.props.openDocument({
              mediaStatus: cmd.type,
              file: this._getFiles(mediaId).file,
            });
          } else {
            this.props.openDocument({
              mediaStatus: cmd.type,
              file: this._getFiles(0).file,
            });
          }
        }
        break;
      default:
        break;
    }
  }

  /**
   * 获取：更新后文件和课件列表；
   * @params {number} fileid:课件的id
   * @params {object} page:页码
   */
  _getFiles(fileid, page = {}) {
    let file = null;
    const fileList = [].concat(this.props.fileList).map(item => {
      if (item.fileid === fileid) {
        file = item;
        if (page.totalPage && item.pagenum !== page.totalPage) {
          item.pagenum = page.totalPage;
        }
        if (page.currentPage && item.currpage !== page.currentPage) {
          item.currpage = page.currentPage;
        }
      }
      return item;
    });
    if (fileid === 0) {
      file = FileItemEvent.addWhiteBoardInfo();
    }
    return {
      file,
      fileList,
    };
  }

  /**
   * 课件排序
   * @params{string} type:排序的类型 fileid / filetype / filename
   */
  handleSort(type) {
    let isAsc = true;
    if (type === this.props.fileSortType) {
      isAsc = !this.props.isAsc;
    }
    this.props.sortFileList({ fileSortType: type, isAsc });
  }

  /**
   * 调用底层sdk删除课件的方法
   * @params {number} fileid 课件的id
   * 备注：成功回调暂时不做处理
   */
  deleteFileLiveRoom(e, fileid) {
    e.stopPropagation();
    globalActions.changeModalMsg(
      {
        type: 'comfirm',
        title: '',
        okBtn: fileProgressBarInner.confirm,
        cancleBtn: fileProgressBarInner.cancel,
        message: fileProgressBarInner.removeFile,
      },
      answer => {
        if (answer) {
          liveRoom.deleteFile(fileid);
        }
      },
    );
  }

  render() {
    return (
      <article
        style={{ top: this.props.isSupportPageTrun ? '-40px' : '0' }}
        className="courseware-box"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <span className="triangle"></span>
        <div className="courseware_content">
          <FileToolBar {...this.props} whiteBoard={this.whiteBoard} handleSort={this.handleSort} deleteFileLiveRoom={this.deleteFileLiveRoom} />
        </div>
      </article>
    );
  }
}
const mapStateToProps = state => {
  const { file } = state;
  return {
    fileList: file.fileList,
    fileSortType: file.fileSortType,
    defaultFileInfo: file.defaultFileInfo,
    selectedFileID: file.selectedFileID,
    HistoryFileId: file.HistoryFileId,
    isAsc: file.isAsc,
  };
};

const mapDispatchToProps = dispatch => ({
  sortFileList: data => dispatch(Actions.sortFileList(data)),
  openDocument: data => dispatch(Actions.openDocument(data)),
  setFileList: data => dispatch(Actions.setFileList(data)),
  updateFileList: data => dispatch(Actions.updateFileList(data)),
  upFilePPT: data => dispatch(Actions.currentIsUpFile(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CourseList);
