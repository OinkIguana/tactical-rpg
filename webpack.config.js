'use strict';
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    entry: './public_html/script/src/index.js',
    output: {
        path: './public_html/',
        filename: 'script/main.js'
    },
    module: {
        loaders: [
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!autoprefixer!sass') },
            { test: /\.js$/, exclude: /node_modules.*\.js/, loader: 'babel' },
            { test: /test.*\.js$/, loader: 'mocha!babel'},
            { test: /\.(otf|ttf)$/, loader: 'url' },
            { test: /\.(svg|png|jpe?g)$/, loader: 'image-webpack' }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style/main.css')
    ],
    devtool: 'source-map',
    watch: true
};