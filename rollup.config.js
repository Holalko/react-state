
const { nodeResolve } = require( '@rollup/plugin-node-resolve');
const commonjs = require( '@rollup/plugin-commonjs');
const typescript = require( 'rollup-plugin-typescript2');

const pkg = require('./package.json');

module.exports= {
    input: 'src/index.ts',
    output: [
        {
            file: './lib/cjs/index.js',
            format: 'cjs',
        },
        {
            file: './lib/esm/index.js',
            format: 'es',
        },
    ],
    external: [...Object.keys(pkg.peerDependencies || {})],
    plugins: [
        nodeResolve(),
        commonjs(),
        typescript({
            typescript: require('typescript'),
        }),
    ],
};