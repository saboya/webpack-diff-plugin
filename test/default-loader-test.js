/* global getEntryPath, expect, runCase */

describe('Default loader', function () {
  it('2 different diffs applied to the same file', function (done) {
    const entry = require(getEntryPath('default-loader'))

    expect(entry[0]).to.be.equal('abc')
    expect(entry[1]).to.be.equal('def')
    expect(entry[2]).to.be.equal('ghi')

    runCase('default-loader', ['1.diff', '2.diff']).then(outFile => {
      const result = require(outFile)

      expect(result[0]).to.be.equal('abc')
      expect(result[1]).to.be.equal('jkl')
      expect(result[2]).to.be.equal('jkl')

      done()
    })
  })
})
