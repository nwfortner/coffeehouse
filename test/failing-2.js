const crypto = require('crypto')
const key = crypto.pbkdf2Sync('secret', 'salt', 1000000, 64, 'sha512')

describe('Failing tests 2: Error Boogaloo', function () {
  it('should fail', function () {
    function stackTest() {
      throw new Error('Bees?!?')
    }

    stackTest()
  })
})
