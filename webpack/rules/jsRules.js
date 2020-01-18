const path = require('path');
exports.common = [{
    test: /\.(js|jsx)$/,
    exclude: [/node_modules/],
    use: ['babel-loader']
  },
  /*{
    test: /\.jsx$/,
    loader: 'webpack-px-to-rem',
    // 这个配置是可选的
    query: {
      // 1rem=npx 默认为 10
      basePx: 50,
      // 只会转换大于min的px 默认为0
      // 因为很小的px（比如border的1px）转换为rem后在很小的设备上结果会小于1px，有的设备就会不显示
      min: 1,
      // 转换后的rem值保留的小数点后位数 默认为3
      floatWidth: 3
    }
  }*/
]

exports.dev = [{
  test: /\.js[x]?$/,
  enforce: 'pre',
  use: [{
    loader: 'eslint-loader',
    options: {
      fix: true
    }
  }],
  include: path.resolve(__dirname, '../../app/**/*.js'),
  exclude: /node_modules/
}]