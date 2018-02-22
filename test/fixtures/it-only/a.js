/* eslint-disable mocha/no-exclusive-tests */

const { sleep } = require('../../helpers');

describe('a', function () {
  it('should not run', function () {});
  it.only('should run', async function () {
    await sleep(10);
  });
});
