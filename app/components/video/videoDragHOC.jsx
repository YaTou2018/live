import React, { useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import { liveRoom, EVENT_TYPE, ROOM_ROLE, BASE_WIDTH, BASE_NUMBER, VIDEO_DRAG_BOUND_ID } from '@global/roomConstants';
import Actions from '@global/actions';
import { YsGlobal } from '@global/handleGlobal';
import Signalling from '@global/services/SignallingService';
import VideoService from '@global/services/VideoService';
import store from '@app/store';

export const videoDragHOC = WrappedComponent => {
  return props => {
    if (YsGlobal.roomInfo.isLiveRoom || YsGlobal.roomInfo.maxVideo <= 2) {
      return <WrappedComponent {...props} />;
    }
    const { streamInfo, videoDragInfo, videoSizeProps = {}, isVideoLayout, doubleVideoId, roomStatus } = props;
    const [renderCount, setRenderCount] = useState(0);
    const videoDrag = videoDragInfo[streamInfo.streamUserId] || {};
    const { resizeScale = 1 } = videoSizeProps.videoResizeStyle || {};
    const headerHeight = YsGlobal.isMobile ? 0 : 0.44;
    const defalutFontSize = (window.innerWidth / BASE_WIDTH) * BASE_NUMBER;
    const content = document.getElementById(VIDEO_DRAG_BOUND_ID) || {}; // 白板拖拽区域
    const contentW = content.clientWidth;
    const contentH = content.clientHeight;

    const dragEnd = (eleOffset, id) => {
      if (eleOffset && id === streamInfo.streamUserId) {
        // const dragEle = document.getElementById(`baseVideoBox_${streamInfo.streamUserId}`) || {}; // 拖拽元素
        // 相对整个页面的坐标px值
        let dragEleOffsetLeft = eleOffset.x;
        let dragEleOffsetTop = eleOffset.y;

        const { initVideoWidth, initVideoHeight } = VideoService.getInitVideoSize();
        const videoWidth = initVideoWidth * resizeScale;
        const videoHeight = initVideoHeight * resizeScale;

        // 拖拽元素不能拖出白板区
        const maxLeft = contentW - videoWidth;
        dragEleOffsetLeft = Math.max(0, Math.min(dragEleOffsetLeft, maxLeft));
        const maxTop = headerHeight * defalutFontSize + contentH - videoHeight;
        dragEleOffsetTop = Math.max(headerHeight * defalutFontSize, Math.min(dragEleOffsetTop, maxTop));
        // 计算相对白板区位置的百分比
        let dragEleLeft = dragEleOffsetLeft / (contentW - videoWidth);
        let dragEleTop = (dragEleOffsetTop - headerHeight * defalutFontSize) / (contentH - videoHeight);
        dragEleLeft = !dragEleLeft || dragEleLeft === Infinity ? 0 : dragEleLeft;
        dragEleTop = !dragEleTop || dragEleTop === Infinity ? 0 : dragEleTop;
        const dragEleStyle = {
          userId: id,
          percentTop: dragEleTop,
          percentLeft: dragEleLeft,
          isDrag: true,
        };
        Actions.setVideoDragInfo(dragEleStyle);
        Signalling.sendSignallingVideoDrag(dragEleStyle, id);
      }
    };

    const percentageToRem = (percentLeft, percentTop) => {
      const { initVideoWidth, initVideoHeight } = VideoService.getInitVideoSize();
      const videoWidth = initVideoWidth * resizeScale;
      const videoHeight = initVideoHeight * resizeScale;
      const videoLeft = (percentLeft * (contentW - videoWidth)) / defalutFontSize;
      const videoTop = YsGlobal.isMobile
        ? (percentTop * (contentH - videoHeight)) / defalutFontSize + 5.625 + 0.8
        : (percentTop * (contentH - videoHeight)) / defalutFontSize;
      return { videoLeft, videoTop };
    };

    useEffect(() => {
      // 拖拽位置改变后需要重新render一次，解决白板大小变化后位置不对的问题
      const count = renderCount + 1;
      setRenderCount(count);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoDragInfo]);

    useEffect(() => {
      const videoDragMsg = YsGlobal.msgList.find(item => item.id === `VideoDrag_${streamInfo.streamUserId}`);
      if (videoDragMsg) {
        YsGlobal.msgList = YsGlobal.msgList.filter(item => item.id !== `VideoDrag_${streamInfo.streamUserId}`);
        Actions.setVideoDragInfo(videoDragMsg.data);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomStatus]);

    useEffect(() => {
      return () => {
        Actions.deleteVideoDragInfo(streamInfo.streamUserId);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const handlePubmsg = res => {
        const { name, data } = res.message;
        if (name === 'VideoDrag') {
          Actions.setVideoDragInfo(data);
        }
      };
      const handleDelmsg = res => {
        const { name, id } = res.message;
        if (name === 'VideoDrag' && id.endsWith(streamInfo.streamUserId)) {
          Actions.deleteVideoDragInfo(streamInfo.streamUserId);
        }
      };
      const listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
      liveRoom.addEventListener(EVENT_TYPE.roomPubmsg, handlePubmsg, listernerBackupid);
      liveRoom.addEventListener(EVENT_TYPE.roomDelmsg, handleDelmsg, listernerBackupid);
      return () => {
        liveRoom.removeBackupListerner(listernerBackupid);
      };
    }, [streamInfo]);

    // 使用 useDrag
    const [, dragSource] = useDrag({
      item: { type: 'videoDrag' },
      begin: () => {
        Actions.setWhiteBoardLay(true);
        return { type: 'videoDrag', id: streamInfo.streamUserId };
      },
      end(item, mintor) {
        Actions.setWhiteBoardLay(false);
        if (mintor.getDropResult()) {
          const { eleOffset } = mintor.getDropResult();
          const { id } = item;
          dragEnd(eleOffset, id);
        }
      },
      canDrag() {
        const { isClassBegin } = store.getState().classroom;
        const mySelfInfo = liveRoom.getMySelf() || {};
        return (
          isClassBegin &&
          mySelfInfo.role !== ROOM_ROLE.STUDENT &&
          !YsGlobal.isVideoStretch &&
          !isVideoLayout &&
          !doubleVideoId &&
          mySelfInfo.role !== ROOM_ROLE.PATROL
        );
      },
    });
    const { videoLeft, videoTop } = percentageToRem(videoDrag.percentLeft, videoDrag.percentTop);

    const videoDragStyle = {
      position: 'fixed',
      top: `${videoTop + headerHeight}rem`,
      left: `${videoLeft}rem`,
      margin: 0,
      transform: 'none',
    };
    const videoDragProps = {
      videoDragStyle: videoDrag.isDrag ? videoDragStyle : {},
      dragSource,
      videoDrag,
    };
    return <WrappedComponent {...props} videoDragProps={videoDragProps} />;
  };
};
