describe('Failing tests 2: Error Boogaloo', function () {
  it('should fail', function () {
    function stackTest() {
      throw new Error('Bees?!?')
    }

    stackTest()
  })
})
