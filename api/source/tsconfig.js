const {ModuleResolutionKind, ModuleKind, ScriptTarget} = require("typescript")

module.exports =  {
    moduleResolution: ModuleResolutionKind.NodeJs,
    module: ModuleKind.CommonJS,
    target: ScriptTarget.ES2019,
    declaration: true,
    removeComments: true,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    sourceMap: true,
    outDir: "./dist",
    baseUrl: "./",
    allowJs: true,
    skipLibCheck: true,
}
