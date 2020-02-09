/* global describe it */

const { deepStrictEqual: equal } = require('assert')
const { join } = require('path')

const { fileFinder } = require('../src/fileFinder')

/**
 * @param {string} cwd
 * @param {string} contextSrc
 * @param {string} includeFile
 */
function callFpie (cwd, contextSrc, includeFile) {
  return fileFinder(contextSrc, includeFile, { cwd }
  )
}

describe('filePacker', () => {
  it('should find foo.txt using a simple include', async () => {
    const output = await callFpie('./test/fixtures/simple', '.', 'include.txt')
    equal(output, ['foo.txt'])
  })

  it('should find foo.txt using wildstar include + exclude rules', async () => {
    const output = await callFpie('./test/fixtures/simple', '.', 'exclude.txt')
    equal(output, ['foo.txt'])
  })

  it('should find foo.txt using absolute paths', async () => {
    const output = await callFpie('./test/fixtures/simple', join(__dirname, `fixtures/simple`), join(__dirname, 'fixtures/simple/include.txt'))
    equal(output, ['foo.txt'])
  })

  it('should find expected files using complex rules', async () => {
    const output = await callFpie('./test/fixtures/complex/includedir', '..', '.includefile_many')
    equal(output, [
      'file with spaces',
      'includedir/.letsinclude',
      'includedir/alsoincludethisfile',
      'includedir/innerincludedir/innerincludefile',
      'includefile',
    ])
  })
})
