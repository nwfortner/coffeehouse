const {
  runMocha,
  runCoffeehouse,
  runCoffeehouseJson,
  cleanReporterOutput
} = require('./helpers');
const expect = require('chai').expect;

describe('Coffeehouse', function () {
  describe('Simple asyncronous tests', function () {
    before(async function () {
      this.res = await runCoffeehouseJson(['test/fixtures/simple']);
    });

    it('should have correct stats', function () {
      expect(this.res.code, 'code').to.equal(0);
      expect(this.res.output.stats.passes).to.equal(3);
      expect(this.res.output.stats.failures).to.equal(0);
    });
  });
});

describe('Comparing Coffeehouse output to Mocha', function () {
  describe('Simple asyncronous tests', function () {
    before(function () {
      this.mochaArgs = ['test/fixtures/simple/c.js', 'test/fixtures/simple/b.js', 'test/fixtures/simple/a.js'];
      this.coffeeArgs = ['test/fixtures/simple'];
    });

    ['spec', 'json'].forEach((reporter) => {
      describe(`${reporter} reporter`, function () {
        before(async function () {
          const reporterOptions = ['--reporter', reporter];
          this.mochaRes = await runMocha(this.mochaArgs.concat(reporterOptions));
          this.coffeeRes = await runCoffeehouse(this.coffeeArgs.concat(reporterOptions));
        });
  
        it('should have the same output', function () {
          cleanReporterOutput(this.mochaRes, reporter);
          cleanReporterOutput(this.coffeeRes, reporter);
          expect(this.coffeeRes).excludingEvery(['duration', 'start', 'end']).to.deep.equal(this.mochaRes);
        });
      });
    });
  });
});
