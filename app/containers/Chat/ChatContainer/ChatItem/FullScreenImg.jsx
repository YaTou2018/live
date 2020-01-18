import React from 'react';

// 聊天消息中图片全屏
function FullScreenImg(props) {
    return (
        <div className='fullScreenImg'  >
            <div className='wrapper'>
                <img src={props.imgUrl} alt=""/>
                <em className='icon icon-del' onClick={props.closeShow}></em>
            </div>
        </div>
    );
}

export default FullScreenImg;