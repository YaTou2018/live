/* eslint-disable react/button-has-type */
/** 课件库 头部 */
import React, { useState } from 'react';
import { liveRoom, ROOM_ROLE } from '@global/roomConstants';
import { YsGlobal } from '@global/handleGlobal';
import store from '@app/store';

const { courseList } = YsGlobal.languageInfo;
const { fileFilterInner, dynamicPPT } = courseList;
export default ({ fileList, fileSortType, isAsc, courseDisabled, handleSort, handleAdd }) => {
  const mySelf = liveRoom.getMySelf() || {};
  const [remind, setremind] = useState(false);
  const [showWrong, setshowWrong] = useState(false);
  const goUpload = () => {
    if (remind) {
      localStorage.setItem('remind', JSON.stringify(true));
    }
    handleAdd('course', 'fewUpload');
    setshowWrong(false);
  };
  const setShowRemindDialog = () => {
    if (JSON.parse(localStorage.getItem('remind'))) {
      handleAdd('course', 'fewUpload');
    } else {
      setshowWrong(true);
    }
  };
  return (
    <div className="fileFilter">
      <div className="flexBox">
        <span className="filterItem fileNumbe">{`${fileFilterInner.courseware}(${fileList.length + 1})`}</span>
        <span className={`filterItem ${fileSortType === 'fileid' ? 'active' : ''}`} onClick={() => handleSort('fileid')} style={{ display: 'none' }}>
          {fileFilterInner.fileTime}
          <span className="flex_box">
            <button className={`up ${isAsc ? 'on' : ''}`} />
            <button className={`down ${isAsc ? '' : 'off'}`} />
          </span>
        </span>
        <span className={`filterItem ${fileSortType === 'filetype' ? 'active' : ''}`} onClick={() => handleSort('filetype')} style={{ display: 'none' }}>
          {fileFilterInner.fileType}
          <span className="flex_box">
            <button className={`up ${isAsc ? 'on' : ''}`} />
            <button className={`down ${isAsc ? '' : 'off'}`} />
          </span>
        </span>
        <span className={`filterItem ${fileSortType === 'filename' ? 'active' : ''}`} onClick={() => handleSort('filename')} style={{ display: 'none' }}>
          {fileFilterInner.fileName}
          <span className="flex_box">
            <button className={`up ${isAsc ? 'on' : ''}`} />
            <button className={`down ${isAsc ? '' : 'off'}`} />
          </span>
        </span>
      </div>
      {showWrong && (
        <div className="promptbox_ppt">
          <p
            className="promptbox_ppt_close"
            onClick={() => {
              setshowWrong(false);
            }}
          ></p>
          <div className="text_wrong_ppt">
            {dynamicPPT.attentionP}
            <br /> {dynamicPPT.one}
            <br /> {dynamicPPT.two}
          </div>
          <div className="wrang_bottom_btn">
            <p></p>
            <button onClick={() => goUpload()}>{dynamicPPT.continue}</button>
            <p
              onClick={() => {
                setremind(!remind);
              }}
            >
              <span className={`${remind ? 'checked' : ''}`}></span>
              {dynamicPPT.noremind}
            </p>
          </div>
        </div>
      )}
      {mySelf.role !== ROOM_ROLE.STUDENT && (
        <>
          <button
            className="addPPTCourse"
            onClick={() => setShowRemindDialog()}
            disabled={store.getState().file.uploadingPPT || store.getState().file.isCurrentUpFile_ppt}
          >
            + {dynamicPPT.addppt}
          </button>
          <button className="addCourse" onClick={() => handleAdd('course', 'upLoadMore')} disabled={courseDisabled}>
            + {fileFilterInner.fileAdd}
          </button>
        </>
      )}
    </div>
  );
};
