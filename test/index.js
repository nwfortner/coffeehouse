const {
  runMocha,
  runCoffeehouse,
  runCoffeehouseJson,
  cleanReporterOutput,
} = require('./helpers');
const { expect } = require('chai');

describe('Coffeehouse', function () {
  describe('Simple asyncronous tests', function () {
    before(async function () {
      this.res = await runCoffeehouseJson(['test/fixtures/simple']);
    });

    it('should have correct stats', function () {
      expect(this.res.code, 'code').to.equal(0);
      expect(this.res).to.have.property('output')
        .to.be.instanceOf(Object)
        .to.have.property('stats');
      expect(this.res.output.stats.passes).to.equal(3);
      expect(this.res.output.stats.failures).to.equal(0);
      expect(this.res.output.stats.pending).to.equal(0);
    });
  });

  describe('describe.only', function () {
    before(async function () {
      this.res = await runCoffeehouseJson(['test/fixtures/describe-only']);
    });

    it('should have correct stats', function () {
      expect(this.res.code, 'code').to.equal(0);
      expect(this.res).to.have.property('output')
        .to.be.instanceOf(Object)
        .to.have.property('stats');
      expect(this.res.output.stats.passes).to.equal(1);
      expect(this.res.output.stats.failures).to.equal(0);
      expect(this.res.output.stats.pending).to.equal(0);
    });
  });

  describe('it.only', function () {
    before(async function () {
      this.res = await runCoffeehouseJson(['test/fixtures/it-only']);
    });

    it('should have correct stats', function () {
      expect(this.res.code, 'code').to.equal(0);
      expect(this.res).to.have.property('output')
        .to.be.instanceOf(Object)
        .to.have.property('stats');
      expect(this.res.output.stats.passes).to.equal(2);
      expect(this.res.output.stats.failures).to.equal(0);
      expect(this.res.output.stats.pending).to.equal(0);
    });
  });
});

describe('Comparing Coffeehouse output to Mocha', function () {
  ['spec', 'json', 'dot'].forEach((reporter) => {
    describe(`${reporter} reporter`, function () {
      before(function () {
        this.reporterOptions = ['--reporter', reporter];
      });

      describe('Simple asyncronous test', function () {
        before(async function () {
          this.mochaRes = await runMocha(['test/fixtures/simple/c.js', 'test/fixtures/simple/b.js', 'test/fixtures/simple/a.js'].concat(this.reporterOptions));
          this.coffeeRes = await runCoffeehouse(['test/fixtures/simple'].concat(this.reporterOptions));
        });

        it('should have the same output', function () {
          cleanReporterOutput(this.mochaRes, reporter);
          cleanReporterOutput(this.coffeeRes, reporter);
          expect(this.coffeeRes).excludingEvery(['duration', 'start', 'end']).to.deep.equal(this.mochaRes);
        });
      });

      describe('describe.only', function () {
        before(async function () {
          this.mochaRes = await runMocha(['test/fixtures/describe-only'].concat(this.reporterOptions));
          this.coffeeRes = await runCoffeehouse(['test/fixtures/describe-only'].concat(this.reporterOptions));
        });

        it('should have the same output', function () {
          cleanReporterOutput(this.mochaRes, reporter);
          cleanReporterOutput(this.coffeeRes, reporter);
          expect(this.coffeeRes).excludingEvery(['duration', 'start', 'end']).to.deep.equal(this.mochaRes);
        });
      });

      describe('it.only', function () {
        before(async function () {
          this.mochaRes = await runMocha(['test/fixtures/it-only/a.js', 'test/fixtures/it-only/b.js'].concat(this.reporterOptions));
          this.coffeeRes = await runCoffeehouse(['test/fixtures/it-only'].concat(this.reporterOptions));
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
