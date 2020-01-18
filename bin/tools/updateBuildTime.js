const fs = require('fs');
const path = require('path');
const compressing = require('compressing');
const delDir = (path) => {
  let files = [];
  if(fs.existsSync(path)){
      files = fs.readdirSync(path);
      files.forEach((file, index) => {
          let curPath = path + "/" + file;
          if(fs.statSync(curPath).isDirectory()){
              delDir(curPath); //递归删除文件夹
          } else {
              fs.unlinkSync(curPath); //删除文件
          }
      });
      fs.rmdirSync(path);
  }
}
fs.readFile(path.resolve(__dirname, '../../app/global/handleGlobal.js'), 'utf-8', (err, data) => {
  if (err) {
    throw Error(err);
  }
  const start = data.indexOf('YsGlobal.updateTime =');
  const str = data.substr(start + 23, 10);
  const date = new Date();
  const replaceStr = `${date.getFullYear()}${date.getMonth() + 1 <= 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}${
    date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate()
  }${date.getHours() <= 9 ? `0${date.getHours()}` : date.getHours()}`;
  fs.writeFile(path.resolve(__dirname, '../../app/global/handleGlobal.js'), data.replace(str, replaceStr), err => {
    if (err) {
      throw err;
    }
    const ysVersion = data.indexOf('YsGlobal.ysVersion =');
    const ysVersionEnd = data.indexOf('\';', ysVersion);
    const zipName = `h5_live_${data.slice(ysVersion + 22, ysVersionEnd)}`;
    delDir(path.resolve(__dirname, `../../${zipName}`)) // 删除打包的文件夹
    fs.rename(path.resolve(__dirname, '../../dist'), path.resolve(__dirname, `../../${zipName}`), err => {
      if (err) throw err;
      compressing.zip
        .compressDir(path.resolve(__dirname, `../../${zipName}`), path.resolve(__dirname, `../../${zipName}.zip`))
        .then(() => {
          console.log(`文件压缩成功\n`);
          console.log('更新打包时间成功==>', replaceStr, '包名为==>', `${zipName}.zip`);
        })
        .catch(() => {
          console.log(`文件压缩失败,请手动压缩`);
        });
    });
  });
});


