/** 课件库（包含头部排序工具条）
 * 目前普通文件和媒体文件未区分
 * 拓展：通过拆分fileList区分文件
 */
import React, { useState } from 'react';
import FileFilter from './FileFilter';
import FileItem from './fileItem';
import FileProgressBar from './fileProgressBar';
import DynamicPPT from './DynamicPPT';
export default props => {
  const [state, setState] = useState({
    fileType: null,
    uploadFileFromFlag: 0, // 上传文件的flag
    courseDisabled: false,
    uploadType: 'upLoadMore',
  });
  const [statePPT, setStatePPT] = useState({
    fileType: null,
    uploadFileFromFlag: 0, // 上传文件的flag
    courseDisabled: false,
    uploadType: 'upLoadMore',
  });
  /**
   * 调用底层sdk删除课件的方法
   * @params {string} type   'course'
   */
  const handleAdd = (type, upLoadT) => {
    if (upLoadT === 'upLoadMore') {
      setState({
        ...state,
        ...{
          fileType: type,
          uploadFileFromFlag: state.uploadFileFromFlag + 1,
          uploadType: upLoadT,
        },
      });
    } else if (upLoadT === 'fewUpload') {
      setStatePPT({
        ...state,
        ...{
          fileType: type,
          uploadFileFromFlag: statePPT.uploadFileFromFlag + 1,
          uploadType: upLoadT,
        },
      });
    }
  };
  /**
   * 更改上传课件按钮的disabled
   */
  const clickDisable = () => {
    setState({
      ...state,
      ...{
        courseDisabled: false,
      },
    });
  };
  /**
   * 更改上传课件按钮的disabled
   */
  const clickEffect = isMedia => {
    setState({
      ...state,
      ...{
        courseDisabled: !isMedia,
      },
    });
  };
  const { fileType, uploadFileFromFlag, courseDisabled, uploadType } = state;
  return (
    <React.Fragment>
      <FileFilter
        fileList={props.fileList}
        fileSortType={props.fileSortType}
        isAsc={props.isAsc}
        courseDisabled={courseDisabled}
        handleSort={props.handleSort}
        handleAdd={handleAdd}
      />
      <div className="fileContainer">
        <DynamicPPT
          clickDisable={clickDisable}
          clickEffect={clickEffect}
          {...props}
          uploadFileFromFlag={statePPT.uploadFileFromFlag}
          fileType={statePPT.fileType}
          uploadType={statePPT.uploadType}
        />
        <FileProgressBar
          clickDisable={clickDisable}
          clickEffect={clickEffect}
          {...props}
          uploadFileFromFlag={uploadFileFromFlag}
          fileType={fileType}
          uploadType={uploadType}
        />
        <FileItem
          fileID={props.selectedFileID}
          key={props.whiteBoard.fileid}
          file={props.whiteBoard}
          openCourseChange={props.openDocument}
          HistoryFileId={props.HistoryFileId}
        />
        {/** 白板 */}
        {props.fileList.map(file => (
          <FileItem
            fileID={props.selectedFileID}
            key={file.fileid}
            file={file}
            isOnlyAudioRoom={props.isOnlyAudioRoom}
            openCourseChange={props.openDocument}
            deleteFileLiveRoom={props.deleteFileLiveRoom}
            HistoryFileId={props.HistoryFileId}
          />
        ))}
        {/** 课件库 */}
      </div>
    </React.Fragment>
  );
};
