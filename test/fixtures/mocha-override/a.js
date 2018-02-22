const { mocha } = require('./index');
const { expect } = require('chai');

describe('overriding mocha require in --required paths', () => {
  it('should', () => {
    expect(mocha).to.have.property('__coffeehouse', true);
  });
});
