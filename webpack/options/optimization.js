exports.devOptimization = {
  providedExports:true,
  runtimeChunk:true,
  noEmitOnErrors:true,
  namedModules:true,
  namedChunks:true
}
exports.prodOptimization = {
  nodeEnv: 'production',
  splitChunks: {
    chunks: 'all',
    maxInitialRequests: 10,
    minSize: 0,
    cacheGroups: {
      vendor: {//提取公共模块到单独的文件
        test: /[\\/]node_modules[\\/]/,
        name: 'commons',
        chunks: 'all',
      }
    },
  },
}
