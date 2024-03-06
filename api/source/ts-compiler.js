const ts = require('typescript');

const formatHost = {
  getCanonicalFileName: path => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine,
};

function getTSConfig() {
  const configPath = ts.findConfigFile(
    './',
    ts.sys.fileExists,
    'tsconfig.json',
  );
  const readConfigFileResult = ts.readConfigFile(configPath, ts.sys.readFile);
  if (readConfigFileResult.error) {
    throw new Error(
      ts.formatDiagnostic(readConfigFileResult.error, formatHost),
    );
  }
  const jsonConfig = readConfigFileResult.config;
  const convertResult = ts.convertCompilerOptionsFromJson(
    jsonConfig.compilerOptions,
    './',
  );
  if (convertResult.errors && convertResult.errors.length > 0) {
    throw new Error(ts.formatDiagnostics(convertResult.errors, formatHost));
  }
  const compilerOptions = convertResult.options;
  return compilerOptions;
}

function displayFilename(originalFunc, operationName) {
  let displayEnabled = false;
  function displayFunction() {
    const fileName = arguments[0];
    if (displayEnabled) {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`${operationName}: ${fileName}`);
    }
    return originalFunc(...arguments);
  }
  displayFunction.originalFunc = originalFunc;
  displayFunction.enableDisplay = () => {
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
  };
  return displayFunction;
}

function compile() {
  const compilerOptions = getTSConfig();
  const compilerHost = ts.createCompilerHost(compilerOptions);
  compilerHost.readFile = displayFilename(compilerHost.readFile, 'Reading');
  compilerHost.readFile.enableDisplay();
  const program = ts.createProgram(
    ['./src/main.ts'],
    compilerOptions,
    compilerHost,
  );
  compilerHost.readFile.disableDisplay();

  console.log(
    ts.formatDiagnosticsWithColorAndContext(
      ts.getPreEmitDiagnostics(program),
      formatHost,
    ),
  );

  compilerHost.writeFile = displayFilename(compilerHost.writeFile, 'Emitting');
  compilerHost.writeFile.enableDisplay()
  const emitResult = program.emit();
  compilerHost.writeFile.disableDisplay();
  console.log(
    ts.formatDiagnosticsWithColorAndContext(emitResult.diagnostics, formatHost),
  );
  return emitResult.diagnostics.length === 0;
}

compile() && require('./dist/main');
