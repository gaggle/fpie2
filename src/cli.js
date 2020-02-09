const { create } = require('tar')

const { fileFinder } = require('./fileFinder')
const { parseArgs } = require('./parseArgs')
const { pipe } = require('./promiseStreams')

/**
 * @param {ParsedArgs} args
 */
async function main (args) {
  const files = await fileFinder(args.contextSrc, args.includeFile)
  if (args.printFiles) {
    console.log(files.map(l => `./${l}`).join('\n'))
  } else {
    await pipe(create({ gzip: true }, files), process.stdout)
  }
}

parseArgs()
  .then(parsedArgs => main(parsedArgs))
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err.message)
    process.exit(1)
  })
