import React from 'react';
import Draggable from 'react-draggable';

export function createDraggable(bounds, dragHandlers) {
  return props => <YSDrag bounds={bounds} dragHandlers={dragHandlers} {...props} />;
}

export default class YSDrag extends React.Component {
  state = {
    activeDrags: 0,
    // fdeltaPosition: {
    //   x: 0,
    //   y: 0,
    // },
    // controlledPosition: {
    //   x: 0,
    //   y: 0,
    // },
    position: {
      x: 0,
      y: 0,
    },
  };

  dragEle = {};

  componentDidMount() {
    const { clientWidth, clientHeight } = this.dragEle;
    const { bounds = '#app' } = this.props;
    const boundsEle = document.querySelector(bounds) || document.querySelector('#app');
    const { clientWidth: parentWidth, clientHeight: parentHeight } = boundsEle;
    this.setState({
      position: {
        x: (parentWidth - clientWidth) / 2,
        y: (parentHeight - clientHeight) / 2,
      },
    });
  }

  onStart = (e, draggableData) => {
    const { moduleName, dragHandlers = {} } = this.props;
    const { onStart } = dragHandlers;
    const { x, y } = draggableData;
    if (typeof onStart === 'function') {
      onStart(
        moduleName,
        {
          position: {
            x,
            y,
          },
        },
        e,
        draggableData,
      );
    }
    let { activeDrags } = this.state;
    this.setState({ activeDrags: (activeDrags += 1) });
  };

  onDrag = (e, draggableData) => {
    const { moduleName, dragHandlers = {} } = this.props;
    const { onDrag } = dragHandlers;
    const { x, y } = draggableData;
    if (typeof onDrag === 'function') {
      onDrag(
        moduleName,
        {
          position: {
            x,
            y,
          },
        },
        e,
        draggableData,
      );
      // console.error('===> args: ', args);
    }
  };

  onStop = (e, draggableData) => {
    const { moduleName, dragHandlers = {} } = this.props;
    const { onStop } = dragHandlers;
    const { x, y } = draggableData;
    let { activeDrags } = this.state;
    this.setState({
      activeDrags: (activeDrags -= 1),
      position: {
        x,
        y,
      },
    });
    if (typeof onStop === 'function') {
      onStop(
        moduleName,
        {
          position: {
            x,
            y,
          },
        },
        e,
        draggableData,
      );
    }
  };

  render() {
    const { position } = this.state;
    const { zIndex = 103, children, ...otherProps } = this.props;
    return (
      <Draggable onStart={this.onStart} onDrag={this.onDrag} onStop={this.onStop} position={position} {...otherProps}>
        <div className="drag-container" ref={ref => (this.dragEle = ref)} style={{ zIndex }}>
          {children}
        </div>
      </Draggable>
    );
  }
}
