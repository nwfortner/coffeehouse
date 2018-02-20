# Coffeehouse ☕️

Run through many different [Mocha][mocha] scenarios concurrently with your very own Coffeehouse ([Chai][chai] optional 😂).

The interface to Coffeehouse is intended to be as similar to Mocha as is practical, though while Coffeehouse is still in early development it's a limited subset (see "Available options", below, for more details). Some options like `--debug` will likely never be implemented because they don't make sense in a concurrent environment; in these situations Mocha should be used directly instead.

## Usage

Coffeehouse is installed via npm. It brings with it a similar version of Mocha, so Mocha does not have to be separately installed. Like Mocha, Coffeehouse does not bring an assertion library with it; use whatever you would use with Mocha (i.e. Chai, Node's `assert` module, etc.). From a terminal in the root directory of your project:

```
$ npm install --save-dev coffeehouse
```

Once installed, Coffeehouse should be invoked from your package's `test` script as normal. From within package.json, replacing `$OPTIONS` with the available options (documented below):

```
{
  "scripts": {
    "test": "coffeehouse $OPTIONS"
  }
}
```

## Available options

- `--recursive` — Include subdirectories while looking for test files. Each of these files will be run in its own child process, just as if they were passed to Coffeehouse individually.
- `--require FILE` — Require the given module in child processes. Useful for attaching custom [Chai][chai] assertions, for example.

## Concurrency model

Inspired by [AVA][ava], Coffeehouse runs one process for each file in the patterns passed to it. For example, if you start Coffeehouse as `coffeehouse test/a.js test/concurrent/*.js`, Coffeehouse will start one process for the tests in `test/a.js`, and one process for every file in the `test/concurrent` directory.

For the curious, Coffeehouse works by running Mocha in each of these child processes with a custom Mocha Reporter. This Reporter uses an [IPC][ipc] channel to talk to the parent process, which collects the results of all processes and re-emits Runner-like events to its own Reporter as configured.

## Alternatives

The following are a sample of alternatives to Coffeehouse for consideration; every dependency should be added with the utmost of intent and care, Coffeehouse included.

- [Mocha][mocha] — If your tests are CPU bound or you otherwise don't "need" concurrency in your tests, there's no reason to use Coffeehouse in lieu of vanilla Mocha.
- [AVA][ava] — Because AVA doesn't use a BDD interface, each test can report its result as soon as it has completed. This makes for a nicer overall user experience, though reporters cannot display as much context around the suite itself. If there is no value in the reports Mocha/Coffeehouse can generate, AVA is a very powerful alternative.
- [Mocha parallel tests runner][mocha-parallel-tests] — Yandex's take on making Mocha concurrent is done within a single process. This requires replacing some of the _behaviour_ of Mocha, and doesn't provide some of the same isolation guarantees that Coffeehouse provides.
- [mocha.parallel][mocha.parallel] — Requires "parallel" tests to be marked up explicitly.

[mocha]: https://mochajs.org/
[chai]: http://chaijs.com/
[ava]: https://github.com/avajs/ava
[ipc]: https://en.wikipedia.org/wiki/Inter-process_communication
[mocha-parallel-tests]: https://github.com/yandex/mocha-parallel-tests
[mocha.parallel]: https://github.com/danielstjules/mocha.parallel
