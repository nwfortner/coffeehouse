describe('Failing tests', function () {
  it('should fail', function () {
    function stackTest() {
      throw new Error('See?!?')
    }

    stackTest()
  })
})
