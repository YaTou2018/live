import React, { PureComponent } from 'react';
import { liveRoom, EVENT_TYPE } from '@global/roomConstants';
import whiteboardService from '@global/services/WhiteboardService';
import ColorPicker from '@components/ColorPicker/ColorPicker';
import YsSliderDumb from '@components/slider/YsSlider';
import Signalling from '@global/services/SignallingService';
import { emitter } from '@utils/';

// import videoMarkService from './VideoMarkService';
import './VideoMark.scss';

export default class VideoMark extends PureComponent {
  ref = null;

  instanceId = 'videoDrawBoard';

  isCreated = false;

  state = {
    activeTool: 'tool_pencil',
    pencilWidth: 5,
    primaryColor: '#FF0000',
    isShowPenList: false,
    isShowEraser: false,
  };

  wbManager = null;

  constructor() {
    super();
    emitter.on(EVENT_TYPE.roomPubmsg, ({ message }) => {
      this.getPubHandler(message.name)(message.data);
    });
    emitter.on(EVENT_TYPE.roomDelmsg, ({ message }) => {
      this.getDelHandler(message.name)(message.data);
    });
    this.wbManager = whiteboardService.getYsWhiteBoardManager();
  }

  whiteBoardCallback(action) {
    // console.error('===> action: ', action);
  }

  componentDidMount() {
    this.getPubHandler('VideoWhiteboard');
  }

  componentWillUnmount() {
    this.wbManager.destroyExtendWhiteboard(this.instanceId);
    this.wbManager.resetWhiteboardData(this.instanceId);
  }

  getPubHandler(handlerName) {
    const handlers = {
      VideoWhiteboard: ({ videoRatio }) => {
        if (!this.ref || this.isCreated) return;
        const whiteboardToolBarConfig = {
          defaultWhiteboardScale: videoRatio,
          initWhiteboardProductionOptions: {
            proprietaryTools: true,
            isBaseboard: false,
            associatedMsgID: 'VideoWhiteboard',
          },
          canDraw: [0, 1].includes(liveRoom.getMySelf().role),
          // defaultWhiteboardScale:16/9 ,
          isLoadWhiteboardToolBar: false,
          backgroundColor: 'transparent',
          primaryColor: '#FF0000',
          eraserWidth: 30,
          pencilWidth: 5,
          shapeWidth: 5,
          fontSize: 48,
        };
        whiteboardService
          .getYsWhiteBoardManager()
          .createExtendWhiteboard(this.ref, this.instanceId, whiteboardToolBarConfig, this.whiteBoardCallback.bind(this));
        this.isCreated = true;
      },
    };
    return handlers[handlerName] || (() => {});
  }

  getDelHandler(handlerName) {
    const handlers = {
      VideoWhiteboard: () => {
        this.wbManager.destroyExtendWhiteboard(this.instanceId);
        this.wbManager.resetWhiteboardData(this.instanceId);
      },
      ClassBegin: () => {
        this.wbManager.destroyExtendWhiteboard(this.instanceId);
        this.wbManager.resetWhiteboardData(this.instanceId);
        liveRoom.pauseShareMedia(false);
      },
    };
    return handlers[handlerName] || (() => {});
  }

  toolChange(activeTool) {
    this.setState({
      activeTool,
      isShowPenList: activeTool === 'tool_pencil',
      isShowEraser: activeTool === 'tool_eraser',
    });
    this.wbManager.useWhiteboardTool(activeTool, this.instanceId);
  }

  pencilWidthChange(pencilWidth) {
    this.setState({
      pencilWidth,
    });
    this.wbManager.changeWhiteBoardConfigration({ pencilWidth }, this.instanceId);
  }

  eraserWidthChange(eraserWidth) {
    this.setState({
      eraserWidth,
    });
    this.wbManager.changeWhiteBoardConfigration({ eraserWidth }, this.instanceId);
  }

  setPrimaryColor(primaryColor) {
    this.setState({
      primaryColor,
    });
    this.wbManager.changeWhiteBoardConfigration({ primaryColor }, this.instanceId);
  }

  exitVideoWB() {
    Signalling.sendVideoMark({}, true);
    liveRoom.pauseShareMedia(false);
  }

  mouseLeave() {
    this.setState({
      isShowPenList: false,
      isShowEraser: false,
    });
  }

  render() {
    const { pencilWidth, activeTool, primaryColor, isShowPenList, isShowEraser, eraserWidth } = this.state;

    return (
      // eslint-disable-next-line no-return-assign
      <div className="video-mark-container" ref={ref => (this.ref = ref)}>
        {[0, 1].includes(liveRoom.getMySelf().role) ? (
          <React.Fragment>
            <div className="mark-tool-container">
              <div className={`mark-tool-pen ${activeTool === 'tool_pencil' ? 'active' : ''}`} onClick={this.toolChange.bind(this, 'tool_pencil')}>
                <em className="icon icon-tool_pencil tool-icon"></em>
                <div
                  className="tool-pen-list-extend "
                  style={{
                    display: isShowPenList && activeTool === 'tool_pencil' ? 'block' : 'none',
                  }}
                  onMouseLeave={this.mouseLeave.bind(this)}
                >
                  <div className="tool-slider">
                    <YsSliderDumb value={pencilWidth} onAfterChange={this.pencilWidthChange.bind(this)} />
                  </div>
                  <div style={{ position: 'relative', borderTop: '1px solid #DEEAFF' }}>
                    <ColorPicker setLineColor={this.setPrimaryColor.bind(this)} selectColor={primaryColor} />
                  </div>
                  <em className="icon-jiantou"></em>
                </div>
              </div>
              <div className={`mark-tool-easer ${activeTool === 'tool_eraser' ? 'active' : ''}`} onClick={this.toolChange.bind(this, 'tool_eraser')}>
                <em className="icon icon-xiangpi tool-icon" />
                <div
                  className="tool-eraser-extend"
                  style={{
                    display: activeTool === 'tool_eraser' && isShowEraser ? 'block' : 'none',
                  }}
                  onMouseLeave={this.mouseLeave.bind(this)}
                >
                  <div className="tool-slider">
                    <YsSliderDumb onAfterChange={this.eraserWidthChange.bind(this)} value={eraserWidth} />
                  </div>
                  <em className="icon-jiantou"></em>
                </div>
              </div>
            </div>
            <div className="mark-exit" onClick={this.exitVideoWB.bind(this, 'exit')}>
              ×
            </div>
          </React.Fragment>
        ) : (
          <div />
        )}
      </div>
    );
  }
}
