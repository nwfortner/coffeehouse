const { sleep, writeToSummary } = require('./helpers')

describe('Second & Fourth', function () {
  it('second', async function () {
    await sleep(200)
    await writeToSummary(2)
  })

  it('fourth', async function () {
    await sleep(200)
    await writeToSummary(4)
  })
})
