import React, { useState } from 'react';
import { liveRoom, ROOM_ROLE } from '@global/roomConstants';
import WhiteboardService from '@global/services/WhiteboardService';

export default ({ file, fileID, isOnlyAudioRoom, deleteFileLiveRoom, HistoryFileId }) => {
  let eyeClassName = '';
  const mySelf = liveRoom.getMySelf() || {};
  const [mediaPlaying, setMediaPlaying] = useState('0');
  let IconClass = null;
  if (file.fileid === fileID) {
    if (HistoryFileId.mediaPlaying && `${HistoryFileId.media}` === `${file.fileid}` && !mediaPlaying) {
      eyeClassName = 'pause';
    } else {
      eyeClassName = 'on';
    }
  }
  if (['png', 'jpeg', 'bmp', 'gif', 'jpg'].includes(file.filetype)) {
    IconClass = 'png';
  } else if (['pptx', 'ppt'].includes(file.filetype)) {
    IconClass = 'pptx';
  } else if (['word', 'doc', 'docx'].includes(file.filetype)) {
    IconClass = 'word';
  } else if (['whiteboard', 'html', 'pdf', 'excle', 'txt', 'zip', 'mp3', 'mp4'].includes(file.filetype)) {
    IconClass = file.filetype;
  } else {
    IconClass = undefined;
  }
  const open = () => {
    if (HistoryFileId.mediaPlaying && `${HistoryFileId.media}` === `${file.fileid}` && mediaPlaying === '0') {
      setMediaPlaying(true);
    }
    if (mediaPlaying) {
      liveRoom.pauseShareMedia(true);
      setMediaPlaying(false);
    } else {
      liveRoom.pauseShareMedia(false);
      setMediaPlaying(true);
    }
    if (file.filetype === 'mp4' && file.filetype === 'mp3') {
      liveRoom.stopShareScreen();
    }
    if (file.fileid !== fileID) {
      liveRoom.stopShareMedia();
      WhiteboardService.getYsWhiteBoardManager().changeDocument(file.fileid, file.currpage);
      setMediaPlaying(true);
    }
  };
  return (
    <div className={`fileItem ${isOnlyAudioRoom && file.filetype === 'mp4' ? 'hide' : ''}`} onClick={() => open(file)}>
      <span className={`fileListIcon ${IconClass}`}></span>
      <span className="fileListTest">{file.filename}</span>
      <span className={`closeIcon ${IconClass} ${eyeClassName}`}></span>
      {mySelf.role !== ROOM_ROLE.STUDENT && (
        <span
          style={{ visibility: file.filetype === 'whiteboard' ? 'hidden' : '' }}
          onClick={e => deleteFileLiveRoom(e, file.fileid)}
          className="deleteIcon"
        ></span>
      )}
    </div>
  );
};
