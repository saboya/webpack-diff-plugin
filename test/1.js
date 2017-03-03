const path = require('path')
global.path = path

global.chai = require('chai')
global.chai.use(require('chai-fs'))
global.expect = global.chai.expect

global.webpack = require('webpack')

const DiffPlugin = require('../lib/index.js').plugin
const outDir = path.normalize(path.join(__dirname, 'out'))

const webpackDefaultOptions = {
  target: 'node',
  context: path.normalize(path.join(__dirname, '..')),
  output: {
    path: outDir,
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          './lib/index.js'
        ]
      }
    ]
  }
}

function getWebpackOptions (testCase, diffFiles) {
  let testCaseOptions = {
    entry: '.' + path.sep + path.join('test', testCase, 'entry.js')
  }

  if (diffFiles.length > 0) {
    testCaseOptions.plugins = [
      new DiffPlugin({
        files: diffFiles.map(file => path.join(__dirname, testCase, file))
      })
    ]
  }

  let options = Object.assign({}, webpackDefaultOptions, testCaseOptions)
  options.output.filename = testCase + '.js'

  return options
}

global.getEntryPath = function (testCase) {
  return path.join(__dirname, testCase, 'entry.js')
}

global.runCase = function (testCase, diffFiles) {
  return new Promise((resolve, reject) => {
    global.webpack(getWebpackOptions(testCase, diffFiles), (err, stats) => {
      if (err) {
        reject(err)
      } else {
        let outFile = path.join(__dirname, 'out', testCase + '.js')
        global.expect(outFile).to.be.a.file()
        resolve(outFile)
      }
    })
  })
}
