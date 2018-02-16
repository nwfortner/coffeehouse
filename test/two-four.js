const { sleep, writeToSummary } = require('./helpers')

describe('Second & Fourth', function () {
  it('second', async function () {
    await sleep(20)
    await writeToSummary(2)
  })

  it('fourth', async function () {
    await sleep(20)
    await writeToSummary(4)
  })
})
