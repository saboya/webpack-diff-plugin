/* global getEntryPath, expect, runCase */

describe('Module patch', function () {
  it('Patch applied to module inside node_modules', function (done) {
    const entry = require(getEntryPath('node-module'))

    expect(entry).to.not.be.undefined

    runCase('node-module', ['no-expect.diff']).then(outFile => {
      console.log(outFile)
      const result = require(outFile)

      expect(result).to.be.undefined

      done()
    })
  })
})
