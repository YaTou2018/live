/* 聊天区-按钮 */
import React from 'react';
import UploadFileFrom from 'UploadFileFrom';
import { YsGlobal } from '@global/handleGlobal';
import { connect } from 'react-redux';
import * as Actions from '@containers/Chat/state/actions';
import { myself } from '@utils/';
const { chatInput } = YsGlobal.languageInfo.chat;
const SEND_GIFTS_NUM = 1;
class ChatInputBtn extends React.Component {
  changeFont() {
    this.props.handleChangeShowFont();
  }

  changeSelectInner(data) {
    this.props.handleChangeFont(data);
  }

  render() {
    const {
      isTeacher,
      userListArr,
      qqFaceShow,
      roleSelectShow,
      imgFlag,
      chatRoleSelectIndex,
      canSendGifts,
      selectUserID,
      selectChat,
      size,
      accept,
      liveAllNoChatSpeaking,
      selectFuc,
      handleOnMouseLeave,
      uploadSuccess,
      handleUserChange,
      fontList,
      nowFont,
      isShowFontList,
    } = this.props;
    /* 所有表情 */
    const EmoticonArrUI = this.props.EmoticonArrUI();
    const { isLiveRoom } = YsGlobal.roomInfo;
    const disablechat = (isLiveRoom ? this.props.liveAllNoChatSpeaking : myself().disablechat) && !isTeacher;
    return (
      <div className="input-top">
        {/* 图片 （主播/助教） */}
        {selectChat === 0 && (selectUserID === '' || undefined) && (
          <div className="sendImgBtn iconWrap">
            <div onClick={() => selectFuc('pic')} className="iconPic_img" title={chatInput.picture} />
            <UploadFileFrom flag={imgFlag} uploadSuccessCallback={uploadSuccess} size={size} accept={accept} />
          </div>
        )}
        {/* 送花（学生） */}
        {!isTeacher && YsGlobal.roomInfo.isLiveRoom && selectChat === 0 && (
          <div
            onClick={() => selectFuc('flowers')}
            className={`flowers iconWrap ${canSendGifts && !liveAllNoChatSpeaking ? '' : ' cur'}`}
            title={chatInput.flowersTitle}
          >
            <span className="icon" />
            <span className="flowersNum">x{SEND_GIFTS_NUM} </span>
          </div>
        )}
        {/* 表情 */}
        {selectChat === 0 && (
          <div className={`emotion-box iconWrap ${disablechat ? ' cur' : ''}`}>
            <div onClick={() => selectFuc('emotion')} className={`icon bqIcon${qqFaceShow ? ' cur' : ''}`} title={chatInput.phiz} />
            <ul className={`qqFace icon-modal${qqFaceShow ? '' : ' hide'}`} onMouseLeave={() => handleOnMouseLeave()}>
              {EmoticonArrUI}
            </ul>
          </div>
        )}
        {/* 看谁消息 */}
        {YsGlobal.roomInfo.isLiveRoom && selectChat === 0 && (
          <>
            {isTeacher ? (
              <div
                className={`iconWrap ${chatRoleSelectIndex === 1 ? 'icon-kejian-onlyMe' : 'icon-kejian-allMsg'}`}
                onClick={() => selectFuc('selectRole', chatRoleSelectIndex === 0 ? 1 : 0)}
                title={chatRoleSelectIndex === 0 ? chatInput.onlyMe : chatInput.allMsg}
              />
            ) : (
              <div className="tosee-box iconWrap">
                <div
                  onClick={() => selectFuc('tosee')}
                  className={`seeWho ${chatRoleSelectIndex !== 0 || roleSelectShow ? ' cur' : ''} cursee${chatRoleSelectIndex}`}
                  disabled={false}
                  title={chatInput.justLook}
                />
                <ul className={`roleSelect icon-modal customSelect ${this.props.roleSelectShow ? '' : 'hide'}`} onMouseLeave={() => handleOnMouseLeave()}>
                  <li className={`customSelect_option ${chatRoleSelectIndex === 0 ? 'active' : ''}`} onClick={() => selectFuc('selectRole', 0)}>
                    {chatInput.allMsg}
                  </li>
                  <li className={`customSelect_option ${chatRoleSelectIndex === 2 ? 'active' : ''}`} onClick={() => selectFuc('selectRole', 2)}>
                    {chatInput.onlyAnchor}
                  </li>
                  <li className={`customSelect_option ${chatRoleSelectIndex === 1 ? 'active' : ''}`} onClick={() => selectFuc('selectRole', 1)}>
                    {chatInput.lookMe}
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
        {/* 全体禁言（主播/助教） */}
        {YsGlobal.roomInfo.isLiveRoom && isTeacher && selectChat === 0 && (
          <div className={`iconWrap ${liveAllNoChatSpeaking && isTeacher ? 'active' : ''}`}>
            <div
              onClick={() => selectFuc('notalking')}
              className={`jinyan${liveAllNoChatSpeaking ? '' : ' cur'}`}
              title={liveAllNoChatSpeaking ? chatInput.LiftAllGagOrders : chatInput.bannedToPost}
            />
          </div>
        )}
        {/* 对谁说 */}
        {YsGlobal.roomInfo.isLiveRoom && selectChat === 0 ? (
          <div className={`toWhoSend ${liveAllNoChatSpeaking && !isTeacher ? 'cur' : ''}`}>
            {chatInput.owner}
            <ul className={`customSelect icon-modal ${liveAllNoChatSpeaking && !isTeacher ? 'hide' : ''}`}>
              <li
                className={`customSelect_option ${selectUserID === '' ? 'active' : ''}`}
                key={0}
                onClick={() =>
                  handleUserChange({
                    selectUserID: '',
                    selectUserNickname: chatInput.owner,
                  })
                }
              >
                {chatInput.owner}
              </li>
              {userListArr.map(user => (
                <li
                  className={`customSelect_option ${selectUserID === user.id ? 'active' : ''}`}
                  key={user.id}
                  onClick={() =>
                    handleUserChange({
                      selectUserID: user.id,
                      selectUserNickname: user.nickname,
                    })
                  }
                >
                  {user.nickname}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {!isLiveRoom ? (
          <div className="font_size_select">
            <div onClick={this.changeFont.bind(this)}>
              <span>{nowFont.fontName}</span>
              <span className="sj_font_size"></span>
              <div className="font-img"></div>
            </div>
            {/*  */}
            <ul className="font_size_list" style={{ display: isShowFontList ? 'block' : 'none' }}>
              {fontList.map(item => (
                <li
                  style={{ fontSize: `${item.fontSize / 100}rem` }}
                  className={nowFont.fontSize === item.fontSize ? 'active' : ''}
                  key={item.fontSize}
                  onClick={this.changeSelectInner.bind(this, item.fontSize)}
                >
                  {item.fontName}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.chat.fontData,
  };
};

const mapDispatchToProps = () => {
  return {
    handleChangeFont: data => {
      Actions.setFontSizeDis(data);
    },
    handleChangeShowFont: () => {
      Actions.setChangeshowFontFn();
    },
  };
};

// 连接组件
export default connect(mapStateToProps, mapDispatchToProps)(ChatInputBtn);
