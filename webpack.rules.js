module.exports = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules\/.+\.node$/,
    use: 'node-loader',
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
      },
    },
  },
  // {
  //   // Move fonts to fonts directory
  //   test: /\.(ttf|woff|woff2)$/,
  //   use: [
  //     {
  //       options: {
  //         name: "[name].[ext]",
  //         outputPath: "fonts/"
  //       },
  //       loader: "file-loader"
  //     }
  //   ]
  // },
  {
    // Move asset files to the assets directory
    test: /\.(png|lua)$/,
    use: [
      {
        options: {
          name: "[name].[ext]",
          outputPath: "assets/"
        },
        loader: "file-loader"
      }
    ]
  },
];
