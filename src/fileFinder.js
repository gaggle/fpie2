const { readFileSync } = require('fs')
const { isAbsolute, join, relative, resolve: pathResolve } = require('path')

const globby = require('globby')

/**
 *
 * @param {string} contextSrc
 * @param {string} includeFile
 * @param {{cwd:string}} opts
 * @returns {Promise<string[]>}
 */
exports.fileFinder = async function (contextSrc, includeFile, opts = {}) {
  const cwd = pathResolve(opts.cwd || process.cwd())
  if (!isAbsolute(includeFile)) includeFile = pathResolve(join(cwd, includeFile))
  if (!isAbsolute(contextSrc)) contextSrc = pathResolve(join(cwd, contextSrc))
  const ruleLines = readFileSync(includeFile).toString().split('\n')
  const includeRules = []
  const excludeRules = []
  ruleLines.forEach(l => {
    if (l.startsWith('#') || l === '') return
    if (l.endsWith('/*')) l = l.slice(0, l.length - 1)
    l.startsWith('!') ? excludeRules.push(l) : includeRules.push(l)
  })
  const result = await globby([...includeRules, ...excludeRules], {
    expandDirectories: true,
    cwd: contextSrc,
    dot: true,
    gitignore: false,
    markDirectories: true,
  })
  return result
    .map(el => relative(contextSrc, pathResolve(contextSrc, el)))
    .sort()
}
