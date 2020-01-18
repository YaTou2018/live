/* eslint-disable no-underscore-dangle */
/* eslint-disable no-case-declarations */
import { getFiletyeByFilesuffix } from '@utils/ysUtils';
import { SET_FILE_LIST, SORT_FILE_LIST, UPDATE_FILE_LIST, OPEN_DOCUMENT, CURRENT_FILE, UPLOADING_PPT } from './action-type';
import { FileListEvent, FileItemEvent } from './service/service';
const initialState = {
  defaultFileInfo: FileItemEvent.addWhiteBoardInfo(), // 默认的文件信息,
  fileList: [],
  fileSortType: 'fileid', // 排序类型 , fileid / filetype / filename
  isAsc: true, // 默认升序
  selectedFileID: FileItemEvent.addWhiteBoardInfo().fileid,
  HistoryFileId: {
    media: '',
    course: '',
    mediaPlaying: null,
  },
  isCurrentUpFile_ppt: false,
  uploadingPPT: false,
};

export default function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    // 是否正在上传ppt课件
    case UPLOADING_PPT:
      return {
        ...state,
        uploadingPPT: payload,
      };
    // 是否正在转换ppt课件
    case CURRENT_FILE:
      return {
        ...state,
        isCurrentUpFile_ppt: payload,
      };

    // 新增课件列表
    case SET_FILE_LIST:
      let defaultFileInfo;
      payload.fileList.forEach(fileInfo => {
        if (
          Number(fileInfo.type) === 1 &&
          !defaultFileInfo &&
          !(getFiletyeByFilesuffix(fileInfo.filetype) === 'mp4' || getFiletyeByFilesuffix(fileInfo.filetype) === 'mp3')
        ) {
          defaultFileInfo = fileInfo;
        } else if (!(getFiletyeByFilesuffix(fileInfo.filetype) === 'mp4' || getFiletyeByFilesuffix(fileInfo.filetype) === 'mp3') && !defaultFileInfo) {
          if (!defaultFileInfo) {
            defaultFileInfo = fileInfo;
          }
        }
      });
      return {
        ...state,
        fileList: payload.fileList,
        defaultFileInfo,
        selectedFileID: '',
      };
    // 更新课件列表
    case UPDATE_FILE_LIST:
      return {
        ...state,
        fileList: payload.fileList,
      };
    // 课件列表排序
    case SORT_FILE_LIST:
      const arr = FileListEvent._sortFileList([...state.fileList], payload);
      return {
        ...state,
        ...payload,
        fileList: arr,
      };
    // 切换课件
    case OPEN_DOCUMENT:
      const HistoryFileId = { ...state.HistoryFileId };
      const { file, mediaStatus } = payload;
      if (file.filetype !== 'mp3' && file.filetype !== 'mp4') {
        HistoryFileId.course = file.fileid;
      } else {
        HistoryFileId.mediaPlaying = file.fileid;
        HistoryFileId.media = file.fileid;
        if (mediaStatus === 'end') {
          HistoryFileId.mediaPlaying = null;
          HistoryFileId.media = '';
        }
      }

      return {
        ...state,
        selectedFileID: mediaStatus === 'end' ? HistoryFileId.course : file.fileid,
        HistoryFileId,
        defaultFileInfo: file,
      };

    // 默认状态
    default:
      return state;
  }
}
