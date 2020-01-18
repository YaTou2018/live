import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Actions from '@global/actions';
import { liveRoom, EVENT_TYPE } from '@global/roomConstants';
import './static/sass/index.scss';
import { YsGlobal } from '@global/handleGlobal';
import { translateAjax } from '@containers/Chat/service/ajax';
// eslint-disable-next-line import/named
import { emoticonToNull, getNowDate } from '@containers/Chat/utils';

class Notification extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      noticeDataInner: '',
    };
  }

  componentDidMount() {
    liveRoom.addEventListener(EVENT_TYPE.roomPubmsg, this.handlerRoomPubmsg.bind(this)); // roomPubmsg事件
  }

  // 接收到发布信令时的处理方法
  handlerRoomPubmsg({ message }) {
    switch (message.name) {
      case 'LiveNoticeInform':
        this.props.setNoticeData(message.data);
        // this.translateFn();
        break;
      default:
        break;
    }
  }

  close() {
    this.props.setNoticeData();
  }

  translateFn() {
    if (this.state.noticeDataInner) return;
    translateAjax(emoticonToNull(this.props.noticeData.text))
      .then(res => {
        if (!res.strmsgToLanguage.length) return;
        this.setState({
          noticeDataInner: res.strmsgToLanguage,
        });
      })
      .catch(err => {
        console.warn(err);
      });
  }

  render() {
    const { noticeData } = this.props;
    const { noticeDataInner } = this.state;
    return (
      <React.Fragment>
        {noticeData && noticeData.text && (
          <>
            {YsGlobal.isMobile && <p className="notice_tz_time">{getNowDate()}</p>}
            <section className="marquee notification-wrapper">
              <div className="tz_icon"></div>
              <div className="tz_inner">
                <div className="content">
                  <span> {noticeData.text}</span>
                  {noticeDataInner ? <p className="remind-msg-innerHTML">{noticeDataInner}</p> : null}
                </div>
              </div>
              {YsGlobal.isMobile && <span className="icon icon-fanyi" onClick={this.translateFn.bind(this)} />}

              {!YsGlobal.isMobile && (
                <div className="tz_close">
                  <i className="icon icon-del" onClick={this.close.bind(this)} />
                </div>
              )}
            </section>
          </>
        )}
      </React.Fragment>
    );
  }
}

Notification.propTypes = {
  noticeData: PropTypes.object,
  setNoticeData: PropTypes.func,
};

const mapStateToProps = state => ({
  noticeData: state.common.noticeData,
});

const mapDispatchToProps = () => ({
  setNoticeData: data => {
    Actions.setNoticeData(data);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
