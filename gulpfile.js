

/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */

'use strict';

const gulp = require('gulp');
const fs = require('fs-extra');
const ps = require('path');
const cp = require('child_process');

gulp.task('build-debug-infos', async () => {
    return await Promise.resolve(require('./gulp/tasks/buildDebugInfos')());
});

gulp.task('build-source', async () => {
    const cli = require.resolve('@cocos/build-engine/dist/cli');
    return cp.spawn('node', [
        cli,
        `--engine=${__dirname}`,
        '--module=system',
        ...process.argv.slice(3),
    ], {
        shell: true,
        stdio: 'inherit',
        cwd: __dirname,
    });
});

gulp.task('build-h5-source', gulp.series('build-debug-infos', async () => {
    const outDir = ps.join('bin', 'dev', 'cc');
    await fs.ensureDir(outDir);
    await fs.emptyDir(outDir);
    const cli = require.resolve('@cocos/build-engine/dist/cli');
    return cp.spawn('node', [
        cli,
        `--engine=${__dirname}`,
        '--module=system',
        '--build-mode=BUILD',
        '--platform=HTML5',
        '--physics=cannon',
        `--out=${outDir}`,
    ], {
        shell: true,
        stdio: 'inherit',
        cwd: __dirname,
    });
}));

gulp.task('build-h5-minified', gulp.series('build-debug-infos', async () => {
    const outDir = ps.join('bin', 'dev', 'cc-min');
    await fs.ensureDir(outDir);
    await fs.emptyDir(outDir);
    const cli = require.resolve('@cocos/build-engine/dist/cli');
    return cp.spawn('node', [
        cli,
        `--engine=${__dirname}`,
        '--module=system',
        '--compress',
        '--sourcemap',
        '--build-mode=BUILD',
        '--platform=HTML5',
        '--physics=cannon',
        `--out=${outDir}`,
    ], {
        shell: true,
        stdio: 'inherit',
        cwd: __dirname,
    });
}));

gulp.task('build-declarations', async () => {
    const outDir = ps.join('bin', '.declarations');
    const { build } = require('@cocos/build-engine/dist/build-declarations');
    await fs.emptyDir(outDir);
    return await build({
        engine: __dirname,
        outDir,
        withIndex: true,
        withExports: false,
        withEditorExports: true,
    });
});

gulp.task('build', gulp.parallel('build-h5-minified', 'build-debug-infos', 'build-declarations'));

gulp.task('code-check', () => {
    return cp.spawn('npx', ['tsc', '--noEmit'], {
        shell: true,
        stdio: 'inherit',
        cwd: __dirname,
    });
});

gulp.task('unit-tests', () => {
    return cp.spawn('npx', ['jest'], {
        shell: true,
        stdio: 'inherit',
        cwd: __dirname,
    });
});

gulp.task('test', gulp.series('code-check', 'unit-tests'));

gulp.task('build-api-json', async () => {
    const APIBuilder = require('./gulp/util/api-docs-build');
    return await Promise.resolve(APIBuilder.generateJson());
});

gulp.task('build-3d-api', async () => {
    const APIBuilder = require('./gulp/util/api-docs-build');
    return await Promise.resolve(APIBuilder.generateHTMLWithLocalization());
});
