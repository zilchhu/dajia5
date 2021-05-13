// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // assetsPublicPath: '/Vue-Admin/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 9001,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: 'http://192.168.3.23:8082', // 要代理的域名
        changeOrigin: true,//允许跨域
        pathRewrite: {
          '^/api': '' // 这个是定义要访问的路径，名字随便写
        }
      },
      '/api2': {
        target: 'http://192.168.3.112:9002', // 要代理的域名
        changeOrigin: true,//允许跨域
        pathRewrite: {
          '^/api2': '' // 这个是定义要访问的路径，名字随便写
        }
      },
      '/api3': {
        target: 'http://192.168.3.112:9020', // 要代理的域名
        changeOrigin: true,//允许跨域
        pathRewrite: {
          '^/api3': '' // 这个是定义要访问的路径，名字随便写
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },

}
