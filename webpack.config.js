const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    watch: true,
    target: 'electron',
    entry: './app/src/entry.js',
    output: {
        path: __dirname + '/app/build',
        publicPath: 'build/',
        filename: 'bundle.js'
    },
    node: {
        __dirname: false,
        __filename: false
    },
    externals: {
        bindings: true
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: ['react'],
                    plugins: ['transform-class-properties']
                }
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    loader: 'css-loader'
                })
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(ttf|eot|woff|woff2|eot)$/,
                loader: "file-loader"
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'bundle.css',
            disable: false,
            allChunks: true
        })
]

}
