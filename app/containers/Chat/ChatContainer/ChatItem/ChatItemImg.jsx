import React, { useState } from 'react';
import { getDocAddress } from '../../constent';

import FullScreenImg from './FullScreenImg';

function ChatItemImg(props) {
  // 消息对象
  const { contents } = props;
  // 点击名字把用户信息传上去
  const { headerNameClick } = props;

  // 是否加载完成
  const [isLoad, setIsLoad] = useState(false);
  // 是否加载失败
  const [isError, setIsError] = useState(false);
  // 是否图片全屏
  const [fullScreenImgIsShow, setFullScreenImgIsShow] = useState(false);
  let timer = null;
  // 处理图片 图片名后加-1
  const Regs = /([^\*]+)(.png|.gif|.jpg|.jpeg)$/;
  const ary = Regs.exec(contents.strmsg);
  const imgurl = `${getDocAddress() + ary[1]}-1${ary[2]}`;

  // 图片加载完成
  const imgLoad = () => {
    setIsLoad(true);
    timer = setTimeout(() => {
      props.onLoads();
      clearTimeout(timer);
    }, 300);
  };

  // 图片加载失败
  const imgError = () => {
    setIsLoad(true);
    setIsError(true);
    props.onLoads();
  };

  // 双击放大图片
  const changebig = () => {
    setFullScreenImgIsShow(true);
  };

  // 退出图片全屏
  const closeShow = () => {
    setFullScreenImgIsShow(false);
  };

  return (
    <div className={`${contents.isMe ? 'isme' : ''} ChatItemImg`}>
      <p className="user-title" onClick={headerNameClick}>
        <span className="send-time">{contents.time}</span>·<span className="username">{contents.who}</span>
      </p>
      <p className="chat-img-warp">
        {isLoad ? null : <img className="maskImg_load" />}
        {isLoad && isError ? <img className="maskImg_load_error" /> : null}
        <img
          className="maskImg"
          src={imgurl}
          alt="聊天图片"
          style={{ display: isLoad && !isError ? 'inline-block' : 'none' }}
          onLoad={imgLoad}
          onError={imgError}
          onDoubleClick={changebig}
        />
      </p>
      {fullScreenImgIsShow ? <FullScreenImg imgUrl={imgurl} closeShow={closeShow} /> : null}
    </div>
  );
}

export default ChatItemImg;
