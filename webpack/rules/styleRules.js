const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = [
  {
    test: /\.(css|scss)$/,
    use: [
      process.env.NODE_ENV === 'development' ? 'style-loader?sourceMap=true' : {
        loader:MiniCssExtractPlugin.loader,
        options:{
          publicPath: '../../'
        }
      },
      'css-loader?sourceMap=true',
      'postcss-loader',
      {
        loader: 'webpack-px-to-rem',
        // 这个配置是可选的
        options: {
          // 1rem=npx 默认为 10
          basePx: 100,
          // 只会转换大于min的px 默认为0
          // 因为很小的px（比如border的1px）转换为rem后在很小的设备上结果会小于1px，有的设备就会不显示
          min: 1,
          // 转换后的rem值保留的小数点后位数 默认为3
          floatWidth: 3
        },
      },
      'sass-loader?sourceMap=true', 
    ],
  }
]