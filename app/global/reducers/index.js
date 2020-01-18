import { combineReducers } from 'redux';
import file from '@containers/CourseList/reducer';
import chat from '@containers/Chat/state/reducer';
import user from './user';
import video from './video';
import ys from './ys';
import common from './common';
import classroom from './classroom';
import Modules from './Modules';
import device from './device';
import whiteboard from './whiteboard';

export default function createRootReducer() {
  return combineReducers({
    ys,
    user,
    video,
    file,
    whiteboard,
    common,
    classroom,
    chat,
    Modules,
    device,
  });
}
