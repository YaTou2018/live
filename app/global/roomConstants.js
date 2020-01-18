/**
 * YS常量
 */
export const YS = window.YS || {};
export const L = window.L || {};
// eslint-disable-next-line import/no-mutable-exports
export const liveRoom = YS.Room && YS.Room();

/**
 * 发布音视频状态
 */
export const PUBLISH_STATE = {
  NONE: 0,
  AUDIOONLY: 1,
  VIDEOONLY: 2,
  BOTH: 3,
  MUTEALL: 4,
};

export const ROOM_STATE = {
  INIT: 'initialize',
  CONNECTED: 'connected',
  DISCONNECT: 'disconnect',
  END: 'end',
};

/* 房间类型 */
export const ROOM_TYPE = {
  CLASS_ROOM: 3, // 小班课
  LIVE_ROOM: 4, // 直播
  MEETING_ROOM: 6, // 会议
};

/* 网络状态质量 */
export const { NET_QUALITY } = YS;
/**
 * YS_NET_QUALITY_EXCELLENT： 1 // 优
 * YS_NET_QUALITY_GOOD： 2 // 良
 * YS_NET_QUALITY_ACCEPTED : 3 // 中
 * YS_NET_QUALITY_BAD： 4 // 差
 * YS_NET_QUALITY_VERYBAD： 5 // 极差
 */

/**
 * 用户角色
 */
export const { ROOM_ROLE } = YS;
/**
 * TEACHER: 0, //老师（主讲）
 * ASSISTANT: 1, //助教
 * STUDENT: 2, //学生
 * AUDIT: 3, //旁听（直播用户） todo 目前没有
 * PATROL: 4, //巡检员（巡课） todo 目前没有
 * SYSTEM_ADMIN: 10, //系统管理员
 * ENTERPRISE_ADMIN: 11, //企业管理员
 * ADMIN: 12, //管理员
 * PLAYBACK: -1, //回放者
 */

/**
 * 房间事件
 */
export const { EVENT_TYPE } = YS;
/**
 * EVENT_TYPE所含事件
 *
 * deviceFailure: "device-failure"
 * deviceNotAvailable: "device-not-available"
 * deviceSuccess: "device-success"
 * getUserMediaFailure: "getUserMedia_failure"
 * getUserMediaFailureReGetOnlyAudioStream: "getUserMedia_failure_reGetOnlyAudioStream"
 * getUserMediaFailureReGetOnlyVideoStream: "getUserMedia_failure_reGetOnlyVideoStream"
 * getUserMediaSuccess: "getUserMedia_success"
 * roomAddFile: "room-add-file"
 * roomAudioVideoStateSwitched: "room-audiovideostate-switched"
 * roomCheckroom: "room-checkroom"
 * roomCheckroomPlayback: "room-checkroom-playback"
 * roomClientClose: "room-client-close"
 * roomClientNotificationOnMediaFileEnded: "room-clientNotification-onMediaFileEnded"
 * roomConnectFail: "room-connect-fail"
 * roomConnectTime: "room-connect-time"
 * roomConnected: "room-connected"
 * roomDeleteFile: "room-delete-file"
 * roomDelmsg: "room-delmsg"
 * roomDisconnected: "room-disconnected"
 * roomError: "room-error"
 * roomErrorNotice: "room-error-notice"
 * roomFileNetworkStateChanged: "room-filenetworkstate-changed"
 * roomFiles: "room-files"
 * roomFirstAudioFrame: "room-first-audio-frame"
 * roomFirstVideoFrame: "room-first-video-frame"
 * roomInfoNotice: "room-info-notice"
 * roomLeaveRoom: "room-leaveroom"
 * roomMediaNetworkStateChanged: "room-medianetworkstate-changed"
 * roomModeChanged: "room-mode-changed"
 * roomMsgList: "room-msglist"
 * roomNativeNotification: "room-native-notification"
 * roomParticipantEvicted: "room-participant_evicted"
 * roomParticipantJoin: "room-participant_join"
 * roomParticipantLeave: "room-participant_leave"
 * roomPlaybackClear_all: "room-playback-clear_all"
 * roomPlaybackDuration: "room-playback-duration"
 * roomPlaybackPlaybackEnd: "room-playback-playbackEnd"
 * roomPlaybackPlayback_updatetime: "room-playback-playback_updatetime"
 * roomPubmsg: "room-pubmsg"
 * roomReconnected: "room-reconnected"
 * roomReconnecting: "room-reconnecting"
 * roomRtcStatsReportEvent: "room-rtcStatsReportEvent"
 * roomScreenNetworkStateChanged: "room-screennetworkstate-changed"
 * roomServerAddressUpdate: "room-serveraddress-update"
 * roomTextMessage: "room-text-message"
 * roomUpdateFile: "room-update-file"
 * roomUserAudioStateChanged: "room-useraudiostate-changed"
 * roomUserFileAttributesUpdate: "room-userfileattributes-update"
 * roomUserFileStateChanged: "room-userfilestate-changed"
 * roomUserMainCameraChanged: "room-usermaincamera-changed"
 * roomUserMediaAttributesUpdate: "room-usermediaattributes-update"
 * roomUserMediaStateChanged: "room-usermediastate-changed"
 * roomUserNetworkStateChanged: "room-usernetworkstate-changed"
 * roomUserPropertyChanged: "room-userproperty-changed"
 * roomUserScreenAttributesUpdate: "room-userscreenattributes-update"
 * roomUserScreenStateChanged: "room-userscreenstate-changed"
 * roomUserVideoAttributesUpdate: "room-uservideoattributes-update"
 * roomUserVideoStateChanged: "room-uservideostate-changed"
 * roomVideoNetworkStateChanged: "room-videonetworkstate-changed"
 * roomWarnNotice: "room-warn-notice"
 */

export const { ERROR_NOTICE } = YS;
/*
  ERR_OK:0, //成功
  ERR_NOT_INITIALIZED:101, //没有初始化
  ERR_INVALID_STATUS:102, //无效状态
  ERR_BAD_PARAMETERS:103, //参数不正确错误码
  ERR_NO_THIS_USER:104, //没有此用户
  ERR_HTTP_REQUEST_FAILED:111, //web接口请求没成功
  ERR_PUBLISH_FAILED:131, //发布失败 自动重连
  ERR_PUBLISH_ROOMMAXVIDEOLIMITED:133,// 媒体链路超限
  ERR_PUBLISH_MAX_RECONNECT_COUNT:134,//超过规定最大重连次数
  ERR_SUBSCRIBE_FAILED:141, //订阅失败 自动重连
  ERR_SUBSCRIBE_STREAM_NOTFOUND:143, //流未发布
*/

/* WARNING级别通知 */
export const { WARNING_NOTICE } = YS;
/*
  WAR_UNPUBLISHVIDEO_BY_SWITCHAUDIOROOM: 1011, // 切换纯音频房间取消发布视频
  WAR_PUBLISHVIDEO_BY_SWITCHAUDIOVIDEOROOM: 1012, // 切换音视频房间发布视频
  WAR_UNPUBLISHVIDEO_BY_MAX_RECONNECT_COUNT: 1013, // 超过规定最大重连次数取消发布视频
  WAR_UNPUBLISHAUDIO_BY_MAX_RECONNECT_COUNT: 1014, // 超过规定最大重连次数取消发布音频
  WAR_UNPUBLISHVIDEO_BY_GET_DEVICE_MEDIASTREAM_FAILURE: 1015, // 获取设备流失败取消发布视频
  WAR_UNPUBLISHAUDIO_BY_GET_DEVICE_MEDIASTREAM_FAILURE: 1016, // 获取设备流失败取消发布音频
*/

/* 上传文件的类型 */
const imgFileListAccpetArr = ['jpg', 'jpeg', 'png', 'bmp', 'gif']; // 图片类型
const mediaFileListAccpetArr = ['mp3', 'mp4']; // 媒体文件类型数组
const h5DocumentFileListAccpetArr = ['zip']; // H5文件类型数组  //xgd 2017-09-21
const documentFileListAccpetArr = ['xls', 'xlsx', 'doc', 'docx', 'txt', 'pdf', 'jpg', 'jpeg', 'png', 'bmp', 'gif', 'mp3', 'mp4', 'zip', 'ppt', 'pptx']; // 普通文件类型数组
const liveAccpetArr = ['xls', 'xlsx', 'doc', 'docx', 'txt', 'pdf', 'jpg', 'jpeg', 'png', 'bmp', 'gif', 'mp3', 'mp4', 'ppt', 'pptx']; // 普通文件类型数组
const dynamicPPTArr = ['ppt', 'pptx'];
export const FILETYPE = {
  imgFileListAccpetArr,
  documentFileListAccpetArr,
  mediaFileListAccpetArr,
  h5DocumentFileListAccpetArr, // xgd 2017-09-21
  imgFileListAccpet: `.${imgFileListAccpetArr.join(',.')}`,
  documentFileListAccpet: `.${documentFileListAccpetArr.join(',.')}`,
  liveAccpet: `.${liveAccpetArr.join(',.')}`,
  dynamicPPT: `.${dynamicPPTArr.join(',.')}`,
  mediaFileListAccpet: `.${mediaFileListAccpetArr.join(',.')}`,
  h5DocumentFileListAccpet: `.${h5DocumentFileListAccpetArr.join(',.')}`,
};
const isMobile = navigator.userAgent.match(/AppleWebKit.*Mobile.*/);
export const BASE_WIDTH = isMobile ? 750 : 1920;
export const BASE_NUMBER = 100;
export const VIDEO_DRAG_BOUND_ID = 'white_board_outer_layout';
export const WB_CONTAINER_ID = 'white_board_outer_layout'; // 白板外层id

// export const PROCESS_ENV = process.env.SERVICE_ENV === 'production' ? 'interaction' : 'demo';
