/*
 * 工具条组件
 * */
import React, { Fragment } from 'react';

import WhiteboardService from '@global/services/WhiteboardService';
import { YsGlobal } from '@global/handleGlobal';
import { liveRoom, ROOM_ROLE } from '@global/roomConstants';
import ToolPenList from './ToolPenList/index';
import ToolText from './ToolText/index';
import ToolShapeList from './ToolShapeList/index';
import ToolEraser from './ToolEraser/index';

import './static/sass/toolsBar.scss';
import './static/font/style.css';
const { tools } = YsGlobal.languageInfo.whiteboard;
class WhiteboardToolsBar extends React.Component {
  constructor() {
    super();
    const mySelf = liveRoom.getMySelf() || {};
    this.state = {
      show: true,
      isActive: 'tool_mouse',
      eraserDisabled: false,
      clearDisabled: false,
      redoDisabled: false,
      undoDisabled: false,
      eraserWidth: 15,
      fontFamily: '微软雅黑',
      fontSize: 48,
      penWidth: 5,
      shapeWidth: 5,
      primaryColor: mySelf.primaryColor,
      pen: 'tool_pencil',
      shape: 'tool_rectangle_empty',
      showSelectType: '', // penPanel：画笔选择框，shapePanel：形状选择框，textPanel：文字选择框，eraserPanel：橡皮选择框
    };
    this.listernerBackupid = `${new Date().getTime()}_${Math.random()}`;
  }

  componentDidMount() {
    liveRoom.addEventListener('receiveWhiteboardSDKAction', this.receiveWhiteboardSDKAction.bind(this), this.listernerBackupid); // 监听room事件：room-delete-file
  }

  componentWillUnmount() {
    liveRoom.removeBackupListerner(this.listernerBackupid);
  }

  // 处理白板回调数据状态
  receiveWhiteboardSDKAction(recvEventData) {
    const { action, cmd = {} } = recvEventData.message;
    if (action === 'currentWhiteboardId' && this.state.showSelectType) {
      this.setState({
        showSelectType: '',
      });
    }
    const { updateViewState, viewState } = cmd;
    if (!updateViewState || !viewState || (updateViewState && !updateViewState.tool && !updateViewState.action && !updateViewState.other)) {
      return;
    }
    let {
      pen,
      shape,
      isActive,
      eraserDisabled,
      clearDisabled,
      redoDisabled,
      undoDisabled,
      fontSize,
      penWidth,
      shapeWidth,
      fontFamily,
      primaryColor,
      eraserWidth,
    } = this.state;
    switch (action) {
      case 'viewStateUpdate':
        {
          const { tool = {}, action: toolAction = {}, other = {} } = viewState;
          const { action_clear: actionClear = {}, action_redo: actionRedo = {}, action_undo: actionUndo = {} } = toolAction;
          Object.entries(tool).forEach(([key]) => {
            if (key === 'tool_pencil' || key === 'tool_highlighter' || key === 'tool_line' || key === 'tool_arrow') {
              if (tool[key].isUse) {
                pen = key;
              }
            }
            if (key === 'tool_rectangle_empty' || key === 'tool_rectangle' || key === 'tool_ellipse_empty' || key === 'tool_ellipse') {
              if (tool[key].isUse) {
                shape = key;
              }
            }
            if (tool[key].isUse) {
              isActive = key;
            }
            eraserDisabled = tool.tool_eraser.disabled;
          });

          clearDisabled = actionClear.disabled;
          redoDisabled = actionRedo.disabled;
          undoDisabled = actionUndo.disabled;

          fontSize = other.fontSize || fontSize;
          penWidth = other.pencilWidth || penWidth;
          shapeWidth = other.shapeWidth || shapeWidth;
          fontFamily = other.fontFamily || fontFamily;
          primaryColor = other.primaryColor || primaryColor;
          eraserWidth = other.eraserWidth || eraserWidth;

          this.setState({
            pen,
            shape,
            isActive,
            eraserDisabled,
            clearDisabled,
            redoDisabled,
            undoDisabled,
            fontSize,
            penWidth,
            shapeWidth,
            fontFamily,
            primaryColor,
            eraserWidth,
          });
        }
        break;
      default:
        break;
    }
  }

  toggle() {
    const { show } = this.state;
    this.setState({ show: !show });
  }

  openToolMouse(type) {
    const { instanceId } = this.props;
    WhiteboardService.getYsWhiteBoardManager().useWhiteboardTool(type, instanceId);
    this.setState({
      isActive: type,
    });
  }

  showShapeList() {
    const { shape, showSelectType } = this.state;
    WhiteboardService.getYsWhiteBoardManager().useWhiteboardTool(shape, this.props.instanceId);
    this.setState({
      isActive: shape,
      showSelectType: showSelectType === 'shapePanel' ? '' : 'shapePanel',
    });
  }

  showPenList() {
    const { pen, showSelectType } = this.state;
    WhiteboardService.getYsWhiteBoardManager().useWhiteboardTool(pen, this.props.instanceId);
    this.setState({
      isActive: pen,
      showSelectType: showSelectType === 'penPanel' ? '' : 'penPanel',
    });
  }

  changePen(e) {
    if (e.target.dataset.type) {
      WhiteboardService.getYsWhiteBoardManager().useWhiteboardTool(e.target.dataset.type, this.props.instanceId);
      this.setState({
        isActive: e.target.dataset.type,
        pen: e.target.dataset.type,
      });
    }
    e.stopPropagation();
  }

  hideAllSelectBox() {
    this.setState({
      showSelectType: '',
    });
  }

  setLineColor(hexColor) {
    if (hexColor) {
      this.setState(
        {
          primaryColor: hexColor,
        },
        () => {
          WhiteboardService.getYsWhiteBoardManager().changeWhiteBoardConfigration({ primaryColor: hexColor }, this.props.instanceId);
        },
      );
    }
  }

  getWidthByType(value, type) {
    if (!type) return false;
    let width = 0;
    switch (type) {
      case 'line':
      case 'shape':
      case 'text':
      case 'eraser':
        width = Math.ceil(Number(value));
        if (width === 0) {
          width = 1;
        }
        break;
      default:
        break;
    }
    return width;
  }

  onAfterChangePenLineWidth(value) {
    const width = this.getWidthByType(value, 'line');
    this.setState({
      penWidth: width,
    });
    WhiteboardService.getYsWhiteBoardManager().changeWhiteBoardConfigration({ pencilWidth: width }, this.props.instanceId);
  }

  onAfterChangeShapeLineWidth(value) {
    const width = this.getWidthByType(value, 'shape');
    WhiteboardService.getYsWhiteBoardManager().changeWhiteBoardConfigration({ shapeWidth: width }, this.props.instanceId);
  }

  openToolLaser(type) {
    WhiteboardService.getYsWhiteBoardManager().useWhiteboardTool(type, this.props.instanceId);
    this.setState({
      isActive: type,
      showSelectType: '',
    });
  }

  openToolText(type) {
    const { showSelectType } = this.state;
    const { instanceId } = this.props;
    WhiteboardService.getYsWhiteBoardManager().useWhiteboardTool(type, instanceId);
    this.setState({
      isActive: type,
      showSelectType: showSelectType === 'textPanel' ? '' : 'textPanel',
    });
  }

  changeFontFamily(e) {
    if (e && e.target && e.target.dataset.fontfamily) {
      this.setState({ fontFamily: e.target.dataset.fontfamily });
      WhiteboardService.getYsWhiteBoardManager().changeWhiteBoardConfigration({ fontFamily: e.target.dataset.fontfamily }, this.props.instanceId);
    }
    e.stopPropagation();
  }

  changeFontSize(value) {
    const width = this.getWidthByType(value, 'text');
    this.setState({ fontSize: width });
    WhiteboardService.getYsWhiteBoardManager().changeWhiteBoardConfigration({ fontSize: width }, this.props.instanceId);
  }

  changeShape(e) {
    if (e && e.target && e.target.dataset.type) {
      WhiteboardService.getYsWhiteBoardManager().useWhiteboardTool(e.target.dataset.type, this.props.instanceId);
      this.setState({
        isActive: e.target.dataset.type,
      });
    }
    e.stopPropagation();
  }

  openToolEraser(type) {
    const { showSelectType } = this.state;
    const { instanceId } = this.props;
    WhiteboardService.getYsWhiteBoardManager().useWhiteboardTool(type, instanceId);
    this.setState({
      isActive: type,
      showSelectType: showSelectType === 'eraserPanel' ? '' : 'eraserPanel',
    });
  }

  changeEraser(e) {
    if (e && e.stopPropagation) {
      return e.stopPropagation();
    }
    return false;
  }

  onAfterChangeEraserWidth(value) {
    const width = Math.floor(this.getWidthByType(value, 'eraser'));
    WhiteboardService.getYsWhiteBoardManager().changeWhiteBoardConfigration({ eraserWidth: width }, this.props.instanceId);
  }

  openToolUndo() {
    WhiteboardService.getYsWhiteBoardManager().undo(this.props.instanceId);
    this.hideAllSelectBox();
  }

  openToolRedo() {
    WhiteboardService.getYsWhiteBoardManager().redo(this.props.instanceId);
    this.hideAllSelectBox();
  }

  openToolClear() {
    WhiteboardService.getYsWhiteBoardManager().clear(this.props.instanceId);
    this.hideAllSelectBox();
  }

  render() {
    const {
      show,
      isActive,
      eraserDisabled,
      clearDisabled,
      redoDisabled,
      undoDisabled,
      showSelectType,
      eraserWidth,
      fontFamily,
      fontSize,
      penWidth,
      primaryColor,
      pen,
      shape,
      shapeWidth,
    } = this.state;

    const mySelf = liveRoom.getMySelf() || {};

    const penProps = {
      showPenList: this.showPenList.bind(this),
      showSelectType,
      changePen: this.changePen.bind(this),
      hideAllSelectBox: this.hideAllSelectBox.bind(this),
      setLineColor: this.setLineColor.bind(this),
      onAfterChangePenLineWidth: this.onAfterChangePenLineWidth.bind(this),
      pen,
      isActive,
      primaryColor,
      penWidth,
    };

    const textProps = {
      openToolText: this.openToolText.bind(this, 'tool_text'),
      changePen: this.changePen.bind(this),
      hideAllSelectBox: this.hideAllSelectBox.bind(this),
      changeFontFamily: this.changeFontFamily.bind(this),
      setLineColor: this.setLineColor.bind(this),
      changeFontSize: this.changeFontSize.bind(this),
      primaryColor,
      fontFamily,
      showSelectType,
      isActive,
      fontSize,
      fontoptionsIsShow: mySelf.role === ROOM_ROLE.STUDENT,
    };

    const shapeProps = {
      showShapeList: this.showShapeList.bind(this),
      showSelectType,
      changeShape: this.changeShape.bind(this),
      hideAllSelectBox: this.hideAllSelectBox.bind(this),
      setLineColor: this.setLineColor.bind(this),
      onAfterChangeShapeLineWidth: this.onAfterChangeShapeLineWidth.bind(this),
      shape,
      isActive,
      primaryColor,
      shapeWidth,
    };

    const eraserProps = {
      openToolEraser: this.openToolEraser.bind(this, 'tool_eraser'),
      changeEraser: this.changeEraser.bind(this),
      hideAllSelectBox: this.hideAllSelectBox.bind(this),
      onAfterChangeEraserWidth: this.onAfterChangeEraserWidth.bind(this),
      eraserDisabled,
      isActive,
      showSelectType,
      eraserWidth,
    };
    return this.props.canDraw && this.props.isClassBegin ? (
      <div>
        <div className={`tool-option_top icon ${show ? 'active' : 'hidebar'}`} onClick={this.toggle.bind(this)} title={tools.toolName} />
        <div className={`tools-icon ${show ? 'icon_up' : 'icon_dowm'}`} onClick={this.toggle.bind(this)} />
        <ul className="tool-Bar-container" style={{ display: show ? 'block' : 'none' }}>
          <li
            className={`tool-option tool_mouse ${isActive === 'tool_mouse' ? 'active' : ''}`}
            onClick={this.openToolMouse.bind(this, 'tool_mouse')}
            title={tools.tool_mouse}
          >
            <em className="icon icon-mouse tool-icon" />
          </li>
          {!YsGlobal.isMobile && (
            <li
              className={`tool-option tool_laser ${isActive === 'tool_laser' ? 'active' : ''}`}
              onClick={this.openToolLaser.bind(this, 'tool_laser')}
              title={tools.tool_laserPen}
            >
              <em className="icon icon-jiguang tool-icon" />
            </li>
          )}
          <ToolPenList {...penProps} />
          <ToolText {...textProps} />
          <ToolShapeList {...shapeProps} />
          <ToolEraser {...eraserProps} />
          {mySelf.role !== ROOM_ROLE.STUDENT && (
            <Fragment>
              <li
                className={`tool-option tool_undo ${undoDisabled ? 'disabled' : ''} ${isActive === 'tool_undo' ? 'active' : ''}`}
                onClick={this.openToolUndo.bind(this, 'tool_undo')}
                title={tools.tool_revoke}
              >
                <em className="icon icon-redo" />
              </li>
              <li
                className={`tool-option tool_redo ${redoDisabled ? 'disabled' : ''} ${isActive === 'tool_redo' ? 'active' : ''}`}
                onClick={this.openToolRedo.bind(this)}
                title={tools.tool_recovery}
              >
                <em className="icon icon-before_default" />
              </li>
              <li
                className={`tool-option tool_clear ${clearDisabled ? 'disabled' : ''} ${isActive === 'tool_clear' ? 'active' : ''}`}
                onClick={this.openToolClear.bind(this)}
                title={tools.tool_clear}
              >
                <em className="icon icon-delete" />
              </li>
            </Fragment>
          )}
        </ul>
      </div>
    ) : (
      ''
    );
  }
}
export default WhiteboardToolsBar;
