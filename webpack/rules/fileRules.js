module.exports = [
  {
    test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          outputPath: "public/fonts/",
          name: "[name].[ext]?[hash:8]",
          publicPath: `${process.env.NODE_ENV === 'development'?'/public/fonts/':'../fonts/'}`,
        }
      },
    ]
  },
  {
    test: /\.(bmp|gif|jpe?g|png)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10,
          outputPath: "public/images/",
          name: "../images/[name].[ext]?[hash:8]",
          // publicPath: `${process.env.NODE_ENV === 'development'?'/public/images/':'../images/'}`,
        }
      },
    ]
  },
  {
    test: /\.(mp4|webm|wav|mp3)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10,
          outputPath: "public/music/",
          name: "/public/music/[name].[ext]?[hash:8]",
          // publicPath: '../../',
        }
      },
    ]
  },
  {
    test: /\.html$/,
    use: {
      loader: 'html-loader',
      options: {
        attrs: ['img:src', 'img:data-src', 'audio:src'],
        minimize: true
      }
    }
  },
]