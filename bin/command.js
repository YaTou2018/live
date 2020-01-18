const shell = require('shelljs');

const option = process.argv[2];

switch (option) {
  case 'lint':
    shell.exec('cross-env eslint --fix ./app/containers/LuckyDraw'); //  --ext=jsx
    break;
  case 'format':
    shell.exec('cross-env onchange "app/**/*.js" "app/**/*.jsx"  -- prettier --write {{changed}}');
    break;
  case 'dev':
    shell.exec(`cross-env webpack-dev-server --config webpack/webpack.dev.js --mode development --progress --colors`);
    break;
  case 'build':
    shell.exec(`cross-env rimraf build && webpack --config webpack/webpack.prod.js --progress --colors`);
    shell.exec(`node bin/tools/updateBuildTime.js`);
    break;
  case 'npmcheckversion':
    shell.exec(`node bin/tools/npmcheckversion.js`);
    break;
  default:
    console.error('Invalid option.');
}
