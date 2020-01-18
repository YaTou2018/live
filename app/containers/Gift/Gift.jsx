import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { uuidv3 } from '@utils/uuid';
import './Gift.scss';
const music = require('./music/gift_default.wav');

const keyFrames = (start, end, timeLen) => {
  const uuid = uuidv3();
  const className = `animation-${uuid}`;
  const animationCss = `@keyframes giftAnimation${uuid}
    {
      from {top: ${start.top};left: ${start.left};}
      to {top: ${end.top};left: ${end.left};width: 0;height: 0;}
    }
    
    @-moz-keyframes giftAnimation${uuid} /* Firefox */
    {
      from {top: ${start.top};left: ${start.left};}
      to {top: ${end.top};left: ${end.left};width: 0;height: 0;}
    }
    
    @-webkit-keyframes giftAnimation${uuid} /* Safari 和 Chrome */
    {
      from {top: ${start.top};left: ${start.left};}
      to {top: ${end.top};left: ${end.left};width: 0;height: 0;}
    }
    
    @-o-keyframes giftAnimation${uuid} /* Opera */
    {
      from {top: ${start.top};left: ${start.left};}
      to {top: ${end.top};left: ${end.left};width: 0;height: 0;}
    }
    .${className} {
      animation: giftAnimation${uuid} ${timeLen}s;
      -moz-animation: giftAnimation${uuid} ${timeLen}s;	/* Firefox */
      -webkit-animation: giftAnimation${uuid} ${timeLen}s;	/* Safari 和 Chrome */
      -o-animation: giftAnimation${uuid} ${timeLen}s;	/* Opera */
    }
  `;
  return {
    styleEle: (
      <style id={`animation_${className}`} type="text/css">
        {animationCss}
      </style>
    ),
    className,
  };
};

const Gift = props => {
  const [className, updateClassName] = useState('gift-animation');
  setTimeout(() => {
    updateClassName(props.className);
  }, 1500);
  return (
    <React.Fragment>
      <div className={`gift ${className}`}></div>
      <audio controls width="0" src={music} autoPlay>
        <track default kind="captions" src={music} />
      </audio>
    </React.Fragment>
  );
};

export default Gift;

export const giftPush = (users = []) => {
  const uuid = uuidv3();
  const timeLen = 3; // 预计3秒动画则写4.5，4.5秒其中两秒是奖杯出现动画
  let userList = users;
  if (!(userList instanceof Array)) userList = [userList];
  let giftContainer = null;
  if (!giftContainer) {
    giftContainer = document.createElement('div');
    giftContainer.id = `giftContainer${uuid}`;
    document.querySelector('body').appendChild(giftContainer);
  }
  ReactDOM.render(
    userList.map(user => {
      const videoEle = document.querySelector(`#baseVideoBox_${user.id}`);
      const videoRect = videoEle.getBoundingClientRect();
      const start = {
        left: '50%',
        top: '50%',
      };
      const end = {
        left: `${videoRect.x + videoEle.offsetWidth / 2}px`,
        top: `${videoRect.y + videoEle.offsetHeight / 2}px`,
      };
      const animationObj = keyFrames(start, end, timeLen - 1.5);
      return (
        <React.Fragment>
          {animationObj.styleEle}
          <Gift className={animationObj.className} />
        </React.Fragment>
      );
    }),
    giftContainer,
  );
  setTimeout(() => {
    ReactDOM.unmountComponentAtNode(giftContainer);
    document.querySelector('body').removeChild(giftContainer);
  }, timeLen * 1000);
};
