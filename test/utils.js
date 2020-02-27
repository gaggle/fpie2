const { ok, AssertionError } = require('assert')

module.exports.assertContains = function (actual, expected) {
  try {
    ok(contains(actual, expected))
  } catch (err) {
    if (err instanceof AssertionError) {
      throw new AssertionError({
        message: `Input A expected to contain input B:
Expected :${expected}
Actual   :${actual}`,
        actual: actual,
        expected: expected,
      })
    }
    throw err
  }
}

module.exports.contains = contains = function (content, needle) {
  return content.indexOf(needle) > 0
}
