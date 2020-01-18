import { isArray } from '@utils/ysUtils';

import { YsGlobal } from '@global/handleGlobal';

const { courseList } = YsGlobal.languageInfo;
const { serviceInner } = courseList;

const HistoryFileId = {
  media: '',
  course: '',
  mediaPlaying: null,
};

const FileItemEvent = {
  /** 加白板信息 */
  addWhiteBoardInfo() {
    const whiteBoardInfo = {
      fileid: 0,
      companyid: '',
      filename: serviceInner.serFileName,
      uploadusername: '',
      downloadpath: '',
      swfpath: '',
      isContentDocument: false,
      filetype: 'whiteboard',
      currpage: 1,
      pagenum: 1,
      dynamicppt: 0,
      filecategory: 0, // 0:课堂 ， 1：系统
      fileprop: 0, // 0：普通文档 ， 1-2：动态ppt(1-旧版，2-新版) ， 3：h5文档
      type: 1,
    };
    return whiteBoardInfo;
  },

  /* 文件上传错误 */
  fileUploadErrorCode(code) {
    const failureText = {
      '-1': serviceInner.conversionWrong,
      '-2': serviceInner.uploadWrong,
      '-3': serviceInner.locationWrong,
      '-4': serviceInner.typeWrong,
      '-5': `${serviceInner.conversionCode}：${code}`,
      '-6': `${serviceInner.conversionCode}：${code}`,
      '-7': serviceInner.noneClass,
      '-8': serviceInner.affiliationClass,
      '-10': serviceInner.exceed,
      '3': serviceInner.fairly,
      '4': serviceInner.lackIndex,
    };
    const text = failureText[String(code)] ? failureText[String(code)] : `${serviceInner.conversionCode}：${code}`;
    return text;
  },
};

const FileListEvent = {
  /* 文件列表排序 */
  // eslint-disable-next-line no-underscore-dangle
  _sortFileList(fileArr, { fileSortType, isAsc }) {
    let whiteboardFileinfo;
    const files = JSON.parse(JSON.stringify(fileArr));
    if (!isArray(files)) {
      return;
    }
    if (files.length && files[0] && files[0].fileid !== 0) {
      for (let i = 0, len = files.length; i < len; i += 1) {
        const file = files[i];
        if (file && file.fileid === 0) {
          whiteboardFileinfo = file;
          files.splice(i, 1);
          break;
        }
      }
    }
    files.sort((obj1, obj2) => {
      if (
        obj1 === undefined ||
        obj2 === undefined ||
        !Object.prototype.hasOwnProperty.call(obj1, fileSortType) ||
        !Object.prototype.hasOwnProperty.call(obj2, fileSortType)
      ) {
        return 0;
      }
      if (obj1.fileid === 0 || obj2.fileid === 0) {
        // return -1 ;
        return obj1 - obj2; //  由于再谷歌浏览器71版本中  直接返回-1 会导致乱序，所以暂时改成这个   zx 2018/9/26
      }
      let obj1Value = obj1[fileSortType];
      let obj2Value = obj2[fileSortType];
      if (fileSortType === 'fileid') {
        obj1Value = Number(obj1Value);
        obj2Value = Number(obj2Value);
      }
      const isAscValue = isAsc ? 1 : -1;
      if (obj1Value > obj2Value) {
        return 1 * isAscValue;
      }
      if (obj1Value < obj2Value) {
        return -1 * isAscValue;
      }
      return 0;
    });
    if (whiteboardFileinfo) {
      files.unshift(whiteboardFileinfo);
    }
    // eslint-disable-next-line consistent-return
    return files;
  },
};
export { FileItemEvent, HistoryFileId, FileListEvent };
