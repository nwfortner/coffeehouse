const assert = require('assert')
const { sleep, clearSummary, readSummary } = require('./helpers')

describe('Mocha parallelization', function () {
  before(async function () {
    await clearSummary()
  })

  it('should parallelize between files', async function () {
    await sleep(500)
    const summary = await readSummary()

    assert.equal(summary, '1234')
  })
})
