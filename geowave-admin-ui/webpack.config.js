'use strict'

const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const pkg = require('./package.json')
const tsconfig = require('./tsconfig.json')
const { execSync } = require('child_process')


const {
    NODE_ENV = 'development',
    API_PROXY = 'http://localhost:3001',
    COMPILER_TARGET = NODE_ENV === 'production' ? tsconfig.compilerOptions.target : 'es2017',
    GIT_REV = execSync('git rev-parse HEAD 2>/dev/null || echo -').toString().trim(),
} = process.env


module.exports = {
    mode: NODE_ENV,

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'tslint-loader',
                enforce: 'pre',
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                options: {
                    target: COMPILER_TARGET,
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]___[local]',
                        },
                    },
                    'less-loader',
                ],
            },
            {
                test: /\.(png|jpg|gif|ttf|((eot|svg|woff2?)(\?.*)?))$/,
                loader: 'file-loader',
            },
        ],
    },

    devServer: {
        proxy: {
            '/api': {
                target: API_PROXY,
                pathRewrite: {'^/api': ''},
                // changeOrigin: true,
            },
        },
        historyApiFallback: true,
        clientLogLevel: 'warning',
    },

    plugins: [
        new HtmlPlugin({
            template: 'src/index.html',
            favicon: `src/images/favicon${NODE_ENV === 'production' ? '' : '-dev'}.png`,
            hash: true,
            xhtml: true,
            app: {
                name: pkg.name,
                version: pkg.version,
                revision: GIT_REV,
            },
        }),
    ],

    devtool: NODE_ENV === 'production' ? 'source-map' : 'cheap-module-source-map',

    context: __dirname,
    entry: './src/main.tsx',
    output: {
        filename: 'build.js',
        path: path.join(__dirname, 'dist/public'),
    },

    resolve: {
        extensions: [".ts", ".tsx", '.js'],
    },

    performance: {
        hints: false,
    },
}
