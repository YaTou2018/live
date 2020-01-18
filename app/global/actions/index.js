import file from '@containers/CourseList/actions';
import * as chat from '@containers/Chat/state/actions';
import user from './user';
import video from './video';
import ys from './ys';
import common from './common';
import classroom from './classroom';
import Modules from './Modules';
import device from './device';
import whiteboard from './whiteboard';

export default {
  ...user,
  ...video,
  ...ys,
  ...common,
  ...classroom,
  ...file,
  ...whiteboard,
  ...chat,
  ...Modules,
  ...device,
};
