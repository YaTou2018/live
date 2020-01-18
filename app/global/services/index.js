import RoomListener from './RoomListener';
import RoomService from './RoomService';
import { YsGlobal } from '../handleGlobal';
import { getServiceInfo } from '../../utils/url';

// 初始化入口
export default function RoomInit() {
  RoomListener.roomConnected();
  RoomListener.roomDisconnected();
  RoomListener.roomCheckroom();
  RoomListener.roomCheckroomPlayback();
  RoomListener.roomUserNetworkStateChanged();
  RoomListener.roomUserPropertyChanged();
  RoomListener.roomUserAudioStateChanged();
  RoomListener.roomUserVideoStateChanged();
  RoomListener.roomPubmsg();
  RoomListener.roomDelmsg();
  RoomListener.roomFiles();
  RoomListener.roomParticipantJoin();
  RoomListener.roomParticipantLeave();
  RoomListener.roomParticipantEvicted();
  RoomListener.roomNotice();
  RoomListener.roomServerAddressUpdate();

  YsGlobal.serviceInfo = Object.assign(YsGlobal.serviceInfo, getServiceInfo());
  RoomService.initRoom();
}
