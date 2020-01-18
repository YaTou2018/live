import React from 'react';
import { liveRoom, EVENT_TYPE } from '@global/roomConstants';
import { MobileChat, MobileChatQusetions, ClassNotice } from '@containers/Chat';
import { MobileSignIn } from '@containers/callRollAndSignIn/signIn'; // 签到
import { MobileLxNotification } from '@containers/ShowAlert'; // 弹框
import { YsGlobal } from '@global/handleGlobal';
import { connect } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';
import MainWhiteboardMobile from '../MainWhiteboardMobile/MainWhiteboardMobile';

import './navbar.scss';
const { pagesText } = YsGlobal.languageInfo;
const { navBarInner } = pagesText;
const { isLiveRoom } = YsGlobal.roomInfo;

class NavbarMobile extends React.Component {
  constructor(props) {
    super(props);
    this.listernerBackupid = new Date();
    this.state = {
      navBarList: [
        {
          text: navBarInner.courseware,
          isShow: true,
          isActive: true,
          hasUnreadMsg: false,
        },
        {
          text: navBarInner.classRoom,
          isShow: true,
          isActive: false,
          hasUnreadMsg: false,
        },
        {
          text: navBarInner.chatText,
          isShow: true,
          isActive: false,
          hasUnreadMsg: false,
        },
        {
          text: navBarInner.questionText,
          isShow: isLiveRoom && props.isClassBegin,
          isActive: false,
          hasUnreadMsg: false,
        },
      ],
    };
  }

  componentDidMount() {
    liveRoom.addEventListener(EVENT_TYPE.roomTextMessage, this.handleRoomTextMessage.bind(this), this.listernerBackupid);
    liveRoom.addEventListener(EVENT_TYPE.roomPubmsg, this.handlerRoomPubmsg.bind(this), this.listernerBackupid); // roomPubmsg事件
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isClassBegin !== this.props.isClassBegin) {
      const navBarList = this.state.navBarList.map(item => {
        const itemInfo = { ...item };
        if (item.text === navBarInner.questionText) {
          itemInfo.isShow = isLiveRoom && this.props.isClassBegin;
        }
        return itemInfo;
      });
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        navBarList,
      });
    }
  }

  componentWillUnmount() {
    liveRoom.removeBackupListerner(this.listernerBackupid);
  }

  handleRoomTextMessage(param) {
    const data = param.message;
    if (data.type === 1 || data.type === 0) {
      const text = data.type === 1 ? navBarInner.questionText : navBarInner.chatText;
      const navBarList = this.state.navBarList.map(item => {
        const itemInfo = { ...item };
        if (!itemInfo.isActive && item.text === text) {
          itemInfo.hasUnreadMsg = true;
        }
        return itemInfo;
      });
      this.setState({
        navBarList,
      });
    }
  }

  handlerRoomPubmsg(param) {
    const pubmsgData = param.message;
    switch (pubmsgData.name) {
      case 'LiveQuestions': {
        const navBarList = this.state.navBarList.map(item => {
          const itemInfo = { ...item };
          if (!itemInfo.isActive && item.text === navBarInner.questionText) {
            itemInfo.hasUnreadMsg = true;
          }
          return itemInfo;
        });
        this.setState({
          navBarList,
        });
        break;
      }
      default:
        break;
    }
  }

  selectModule = ind => {
    this.changeNavBarItem(ind);
    this.props.getSwiperIndex(ind);
  };

  changeContainer = ind => {
    this.changeNavBarItem(ind);
    this.props.getSwiperIndex(ind);
  };

  changeNavBarItem(ind) {
    const navBarList = this.state.navBarList.map((item, index) => {
      const itemInfo = { ...item };
      if (ind === index) {
        itemInfo.isActive = true;
        itemInfo.hasUnreadMsg = false;
      } else {
        itemInfo.isActive = false;
      }
      return itemInfo;
    });
    this.setState({
      navBarList,
    });
  }

  render() {
    const { navBarList } = this.state;
    const { isMp4AllFull, isClassBegin } = this.props;
    const swiperIndex = navBarList.findIndex(item => item.isActive);
    return (
      <React.Fragment>
        <ul className="navBar">
          {navBarList.map((item, index) => {
            return (
              item.isShow && (
                <li className={item.isActive ? 'active' : ''} onClick={() => this.selectModule(index)} key={index.toString()}>
                  {item.hasUnreadMsg && <i className="tips"></i>}
                  {item.text}
                </li>
              )
            );
          })}
        </ul>
        {isLiveRoom && isClassBegin ? (
          <SwipeableViews
            id="swiperBox"
            className={`swiperBox ${isMp4AllFull ? 'swiperBoxAllFull' : ''}`}
            index={swiperIndex}
            onChangeIndex={this.changeContainer.bind(this)}
          >
            <MainWhiteboardMobile />
            <ClassNotice />
            <MobileChat />
            <MobileChatQusetions />
          </SwipeableViews>
        ) : (
          <SwipeableViews
            id="swiperBox"
            disabled={!isLiveRoom}
            className={`swiperBox ${isMp4AllFull ? 'swiperBoxAllFull' : ''}`}
            index={swiperIndex}
            onChangeIndex={this.changeContainer.bind(this)}
          >
            <MainWhiteboardMobile />
            <ClassNotice />
            <MobileChat />
          </SwipeableViews>
        )}

        <section>
          <MobileSignIn />
          <MobileLxNotification />
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isMp4AllFull: state.Modules.isMp4AllFull,
  isClassBegin: state.classroom.isClassBegin,
});

export default connect(mapStateToProps)(NavbarMobile);
