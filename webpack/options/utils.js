const path = require('path');
// const md5 = require('md5');

// 获得当前执行文件所在目录的完整目录名
exports.resolve = function(dir) {
  return path.join(__dirname, '../../', dir);
};
// 获得当前执行node命令时候的文件夹目录名 
exports.cwd = function(src) {
  path.join(process.cwd(), 'src')
}

// 指向dist文件路径
exports.resolveAssetsRootDir = function(dir) {
  return path.join(dir);
};