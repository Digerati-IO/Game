var path = require('path'),
  webpack = require('webpack'),
  BrowserSyncPlugin = require('browser-sync-webpack-plugin'),

// Phaser webpack config
  phaserModule = path.join(__dirname, '/node_modules/phaser-ce/'),
  phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
  pixi = path.join(phaserModule, 'build/custom/pixi.js'),
  p2 = path.join(phaserModule, 'build/custom/p2.js'),
  isometric = path.join(__dirname, 'src/Plugins/phaserplugin'),

  definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
  });

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/Main.js')
    ],
    vendor: ['pixi', 'p2', 'phaser', 'webfontloader']
  },
  devtool: 'source-map',
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    publicPath: './dist/',
    filename: 'bundle.js'
  },
  watch: true,
  plugins: [
    definePlugin,
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'/* chunkName= */,
      filename: 'vendor.bundle.js'/* filename= */
    })/*,
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      server: {
        baseDir: ['./', './build']
      }
    })*/
  ],
  module: {
    rules: [
      {test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src')},
      {test: /pixi\.js/, use: ['expose-loader?PIXI']},
      {test: /phaser-split\.js$/, use: ['expose-loader?Phaser']},
      {test: /p2\.js/, use: ['expose-loader?p2']}
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolve: {
    alias: {
      'phaser': phaser,
      'pixi': pixi,
      'p2': p2
    }
  }
};
