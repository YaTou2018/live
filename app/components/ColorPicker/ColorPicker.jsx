/* 颜色选择器组件 */
import React from 'react';
import { liveRoom } from '@global/roomConstants';
import './static/purple.scss';
import './static/font/style.css';
import UserService from '@global/services/UserService';

const YSColorPicker = props => {
  const { selectColor, setLineColor } = props;
  const colorArr = [
    '#000000',
    '#9B9B9B',
    '#FFFFFF',
    '#FF7EA1',
    '#FF3B58',
    '#FF0000',
    '#F08218',
    '#B66700',
    '#8F4200',
    '#FF7500',
    '#FFD100',
    '#FFF600',
    '#ABD500',
    '#78BC24',
    '#2EA937',
    '#16B4A4',
    '#40C3FF',
    '#008DEB',
    '#0043FF',
    '#BFC7FF',
    '#E352FF',
    '#76288B',
    '#412088',
    '#0F2378',
  ];

  const handleClickSelectColor = color => {
    if (typeof setLineColor === 'function') {
      const mySelf = liveRoom.getMySelf();
      UserService.changeVideoUserPen(mySelf.id, color);
      setLineColor(color);
    }
  };

  return (
    <ul className="color-picker">
      {colorArr.map(color => {
        return (
          <li
            key={color}
            className={`select-color${color.replace(/#/, '')} ${selectColor === color ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={handleClickSelectColor.bind(this, color)}
          >
            {/* {this.isMobile && ( 
              <em className={`color-icon ${selectColor === color ? `icon-${color.replace(/#/, '')}_selected` : `icon-${color.replace(/#/, '')}`}`} /> 
             )} */}
          </li>
        );
      })}
    </ul>
  );
};

export default YSColorPicker;
