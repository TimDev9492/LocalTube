const webpack = require('webpack');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.FLUENTFFMPEG_COV': false
    }),
    // new WebpackShellPluginNext({
    //   onBuildStart: {
    //     scripts: ['echo "Webpack Start"'],
    //   },
    //   onBuildEnd: [
    //     'echo "Webpack Start"',
    //     'chmod +x .webpack/main/native_modules/ffmpeg',
    //     'chmod +x .webpack/main/native_modules/ffprobe',
    //     `echo "${__dirname}"`
    //   ]
    // })
    new WebpackShellPluginNext({

      onBuildEnd: {
        scripts: [
          'chmod +x .webpack/main/native_modules/ffmpeg',
          'chmod +x .webpack/main/native_modules/ffprobe',
        ],
        blocking: false,
        parallel: true
      }
    }),
  ]
};
