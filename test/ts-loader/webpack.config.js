const libPath = '../../lib/index.js'
const DiffPlugin = require(libPath).plugin

module.exports = {
  target: 'node',
  output: {
    path: __dirname,
    filename: 'out.js'
  },
  resolve: {
    extensions: ['.ts']
  },
  entry: './test/ts-loader/example.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'ts-loader',
          libPath
        ]
      }
    ]
  },
  plugins: [
    new DiffPlugin({
      files: [
        '1.diff',
        '2.diff'
      ]
    })
  ]
}
