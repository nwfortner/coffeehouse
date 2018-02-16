const { sleep, writeToSummary } = require('./helpers')

describe('First & Third', function () {
  it('first', async function () {
    await sleep(100)
    await writeToSummary(1)
  })

  it('third', async function () {
    await sleep(200)
    await writeToSummary(3)
  })
})
