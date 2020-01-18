import { YsGlobal } from '../../../global/handleGlobal';

const { deviceTest } = YsGlobal.languageInfo;
const { resultsInner } = deviceTest;
const shipinDoing = require('../static/img/shipin_doing@2x.png');
const shipinDone = require('../static/img/shipin_done@2x.png');
const yangshengqiNone = require('../static/img/yangshengqi_none@2x.png');
const yangshengqiDoing = require('../static/img/yangshengqi_doing@2x.png');
const yangshengqiDone = require('../static/img/yangshengqi_done@2x.png');
const maikefengNone = require('../static/img/maikefeng_none@2x.png');
const maikefengDoing = require('../static/img/maikefeng_doing@2x.png');
const maikefengDone = require('../static/img/maikefeng_done@2x.png');
const jieguoNone = require('../static/img/jieguo_none@2x.png');
const jieguoDoing = require('../static/img/jieguo_doing@2x.png');
const shipinNot = require('../static/img/shipin_not.png');
const yangshengqiWrong = require("../static/img/yangshengqi_wrong.png");
const shipinWrong = require("../static/img/shipin_wrong.png");
const maikefengWrong = require("../static/img/maikefeng_wrong.png");

// 设备检测tabs列表
const detectionList = (isCheckVideoDevice, isCheckAudioOutput) => {
  return [
    {
      key: 'audiooutput',
      index: 0,
      text: resultsInner.detecSpeacker,
      icon: yangshengqiNone,
      iconArr: [yangshengqiNone, yangshengqiDoing, yangshengqiDone, yangshengqiWrong],
      // notTeacherHas: true,
      isCheck: isCheckAudioOutput,
      type: 'all',
      last: false,
    },
    {
      key: 'videoinput',
      index: 1,
      text: resultsInner.detecVideo,
      icon: shipinDoing,
      iconArr: [shipinNot, shipinDoing, shipinDone, shipinWrong],
      // notTeacherHas: false,
      isCheck: isCheckVideoDevice,
      type: 'all',
      last: false,
    },
    {
      key: 'audioinput',
      index: 2,
      text: resultsInner.detecMicro,
      icon: maikefengNone,
      iconArr: [maikefengNone, maikefengDoing, maikefengDone, maikefengWrong],
      // notTeacherHas: false,
      isCheck: isCheckVideoDevice,
      type: 'all',
      last: false,
    },
    {
      key: 'testresult',
      index: 3,
      text: resultsInner.result,
      icon: jieguoNone,
      iconArr: [jieguoNone, jieguoDoing, jieguoNone, jieguoDoing],
      // notTeacherHas: true,
      isCheck: isCheckVideoDevice || isCheckAudioOutput,
      type: 'detection',
      last: true,
    },
    {
      key: 'systemInfo',
      index: 3,
      text: resultsInner.systemMsg,
      icon: '',
      // notTeacherHas: true,
      isCheck: true,
      type: 'setting',
      last: true,
    },
  ];
};
export const getTabsData = (type, selectKey) => {
  const detectionLists = detectionList(YsGlobal.isCheckVideoDevice, YsGlobal.isCheckAudioOutput)
    .filter(item => item.type === type || item.type === 'all')
    .filter(item => item.isCheck);
  const tempArr = detectionLists.map(item => item.key);
  const tabsIndex = tempArr.indexOf(selectKey);
  return detectionLists.map((item, index) => {
    if (item.type === 'setting') return item;
    const temp = item;
    if (index < +tabsIndex) temp.icon = item.iconArr[2];
    if (index === +tabsIndex) temp.icon = item.iconArr[1];
    if (index > +tabsIndex) temp.icon = item.iconArr[0];
    return temp;
  });
};
