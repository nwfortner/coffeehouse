describe('Double Trouble', function () {
  it('We need to bring back dice poppers', function () {
  })
})

describe('Failing tests', function () {
  it('should fail', function () {
    function stackTest() {
      throw new Error('See?!?')
    }

    stackTest()
  })

  describe('Nested inside', function () {
    it('should do something interesting')
  })
})
