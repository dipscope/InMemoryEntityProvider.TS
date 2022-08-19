const Path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        index: './src/index.ts'
    },
    output: {
        path: Path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'InMemoryEntityProvider',
        libraryTarget: 'umd',
        globalObject: 'this',
        umdNamedDefine: true
    },
    externals: {
        'lodash': {
            commonjs: 'lodash',
            commonjs2: 'lodash',
            amd: 'lodash',
            root: '_'
        },
        '@dipscope/type-manager': {
            commonjs: '@dipscope/type-manager',
            commonjs2: '@dipscope/type-manager',
            amd: '@dipscope/type-manager',
            root: 'TypeManager'
        },
        '@dipscope/entity-store': {
            commonjs: '@dipscope/entity-store',
            commonjs2: '@dipscope/entity-store',
            amd: '@dipscope/entity-store',
            root: 'EntityStore'
        }
    },
    plugins: [
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            include: /src/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: process.cwd()
        })
    ],
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: [{
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.webpack.json'
                }
            }],
            exclude: /node_modules/,
            include: [
                Path.resolve(__dirname, 'src')
            ],
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};
