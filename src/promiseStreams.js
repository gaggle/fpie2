const { finished, from, pipe } = require('mississippi')
const { promisify } = require('util')

module.exports.finished = promisify(finished)
module.exports.from = promisify(from)
module.exports.pipe = promisify(pipe)

module.exports.fromString = function (string) {
  return from(function (size, next) {
    // if there's no more content
    // left in the string, close the stream.
    if (string.length <= 0) return next(null, null)

    // Pull in a new chunk of text,
    // removing it from the string.
    const chunk = string.slice(0, size)
    string = string.slice(size)

    // Emit "chunk" from the stream.
    next(null, chunk)
  })
}
