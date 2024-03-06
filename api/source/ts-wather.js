const ts = require('typescript');
const { join, dirname } = require('path');
const { exit } = require('process');

const formatHost = {
  getCanonicalFileName: (path) => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine,
};

function on(host, functionName, before, after) {
  const originalFunction = host[functionName];
  host[functionName] = function () {
    before && before(...arguments);
    const result = originalFunction && originalFunction(...arguments);
    after && after(result);
    return result;
  };
}

function clearCache() {
  const cacheKeys = Object.keys(require.cache);
  const paths = [
    join(__dirname, 'dist'),
    dirname(require.resolve('typeorm')),
    dirname(require.resolve('@nestjs/typeorm')),
  ];
  cacheKeys
    .filter((item) => paths.filter((p) => item.startsWith(p)).length > 0)
    .forEach((item, index, arr) => {
      delete require.cache[item];
      process.stdout.clearLine(); // clear current text
      process.stdout.cursorTo(0); // move cursor to beginning of line
      process.stdout.write(
        `Clearing cache ${Math.floor((index * 100) / arr.length + 1)}%`,
      );
    });
  process.stdout.write(' finished.\n');
}

function displayFilename(originalFunc, operationName) {
  let displayEnabled = false;
  let counter = 0;
  function displayFunction() {
    const fileName = arguments[0];
    if (displayEnabled) {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`${operationName}: ${fileName}`);
    }
    counter++;
    return originalFunc(...arguments);
  }
  displayFunction.originalFunc = originalFunc;
  displayFunction.enableDisplay = () => {
    counter = 0;
    if (process.stdout.isTTY) {
      displayEnabled = true;
    }
  };
  displayFunction.disableDisplay = () => {
    if (displayEnabled) {
      displayEnabled = false;
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
    }
    console.log(`${counter} times function was called`);
  };
  return displayFunction;
}

async function watchMain() {
  const configPath = ts.findConfigFile(
    './',
    ts.sys.fileExists,
    'tsconfig.json',
  );

  const host = ts.createWatchCompilerHost(
    configPath,
    {},
    ts.sys,
    ts.createEmitAndSemanticDiagnosticsBuilderProgram,
    (diagnostic) =>
      console.log(
        ts.formatDiagnosticsWithColorAndContext([diagnostic], formatHost),
      ),
    (diagnostic) =>
      console.log(
        'Watch status: ',
        ts.formatDiagnosticsWithColorAndContext([diagnostic], formatHost),
      ),
  );

  host.readFile = displayFilename(host.readFile, 'Reading');
  let app;
  on(
    host,
    'createProgram',
    () => {
      console.log("** We're about to create the program! **");
      app && app.close().then(() => (app = undefined));
      host.readFile.enableDisplay();
    },
    () => {
      host.readFile.disableDisplay();
      console.log('** Program created **');
    },
  );
  let currentProgram;
  on(
    host,
    'afterProgramCreate',
    (program) => {
      console.log('** We finished making the program! Emitting... **');
      currentProgram = program;
    },
    () => {
      console.log('** Emit complete! **');
      const onAppClosed = () => {
        if (app) {
          setTimeout(onAppClosed, 100);
        } else {
          clearCache();
          require('./dist/bootstrap')
            .bootstrap()
            .then((res) => {
              app = res;
            });
        }
      };
      if (currentProgram && currentProgram.getSemanticDiagnostics().length === 0) {
        onAppClosed();
      }
    },
  );

  ts.createWatchProgram(host);
}
process.exit = (code) => {
  console.log('!!!!!!!!!!!!!!!!!!!!!!! WARNING!!!!!!!!!!!!!!!!!!!!!!!!!');
  console.trace(`Process try to exit with code ${code}.`);
};
watchMain();
