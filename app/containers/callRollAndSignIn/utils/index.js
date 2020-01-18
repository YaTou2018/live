import { sendSignalling } from '@utils';
// import { post } from '@utils/request';

function getUniqueId(serial) {
  const d = new Date();
  const num = Math.random() * 900;
  return serial + d.getFullYear() + (d.getMonth() + 1) + d.getDate() + num;
}

function getTs() {
  // 获取本地10位时间戳
  return Date.parse(new Date()) / 1e3;
}

function ms2minute(ms) {
  const sTotal = parseInt(ms / 1000, 10);
  const m = parseInt(sTotal / 60, 10);
  const s = sTotal % 60;
  return {
    minutes: m > 9 ? m : `0${m}`,
    seconds: s > 9 ? s : `0${s}`,
  };
}

export default {
  getUniqueId,
  getTs,
  ms2minute,
};
