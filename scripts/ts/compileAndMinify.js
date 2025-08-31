import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import * as terser from 'terser';

const tsConfigPath = './tsconfig.json';

function coloredLog(messages) {
  const colorCodes = {
    reset: "\x1b[0m",
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m"
  };

  let formattedMessage = "";
  for (const { color, text } of messages) {
    const colorCode = colorCodes[color.toLowerCase()] || colorCodes.reset;
    formattedMessage += `${colorCode}${text}`;
  }
  formattedMessage += colorCodes.reset;
  console.log(formattedMessage);
}

async function compileAndMinify() {
  // 讀取 tsconfig.json
  const tsConfig = ts.readConfigFile(tsConfigPath, ts.sys.readFile);

  // 解析編譯選項
  const compilerOptions = ts.parseJsonConfigFileContent(
    tsConfig.config,
    ts.sys,
    path.dirname(tsConfigPath)
  );

  // 建立 Program 並編譯
  const program = ts.createProgram(compilerOptions.fileNames, compilerOptions.options);
  const emitResult = program.emit();

  if (emitResult.emitSkipped) {
    coloredLog([
      { color: 'red', text: '✘ 編譯失敗。' },
      { color: 'reset', text: ' 請檢查 TypeScript 錯誤。' }
    ]);
    return;
  }

  // 處理已編譯的 .ts 文件
  const outDir = compilerOptions.options.outDir || '.';
  const rootDir = compilerOptions.options.rootDir || '.';

  const sourceFiles = program.getSourceFiles().filter(sf =>
    !sf.isDeclarationFile && !sf.fileName.includes('node_modules')
  );

  for (const sourceFile of sourceFiles) {
    const relPath = path.relative(rootDir, sourceFile.fileName);
    const jsFilePath = path.join(outDir, relPath.replace(/\.ts$/, '.js'));

    if (!fs.existsSync(jsFilePath)) {
      coloredLog([{ color: 'yellow', text: `⚠ 找不到 JS 文件：${jsFilePath}\n` }]);
      continue;
    }

    const code = fs.readFileSync(jsFilePath, 'utf-8');

    try {
      const result = await terser.minify(code, {
        mangle: {
          toplevel: true,
          properties: {
            regex: /^_/
          }
        },
        compress: {
          drop_console: true,
          passes: 3,
          booleans_as_integers: true,
          evaluate: true,
          keep_fargs: false,
          keep_fnames: false
        },
        output: {
          beautify: false,
          comments: false,
          ascii_only: true
        },
        ecma: 2015
      });

      if (result.error) {
        coloredLog([
          { color: 'red', text: `✘ 混淆失敗：` },
          { color: 'reset', text: `${jsFilePath}\n${result.error}` }
        ]);
      } else if (result.code) {
        fs.writeFileSync(jsFilePath, result.code);
        coloredLog([
          { color: 'green', text: `✔ 已混淆：` },
          { color: 'reset', text: `${jsFilePath}` }
        ]);
      }
    } catch (err) {
      coloredLog([
        { color: 'red', text: `❌ 混淆錯誤：` },
        { color: 'reset', text: `${jsFilePath}\n${err}` }
      ]);
    }
  }
}

compileAndMinify();
