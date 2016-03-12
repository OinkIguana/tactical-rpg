'use strict';
module.exports = {
    entry: './public_html/script/src/index.js',
    output: {
        path: './public_html/',
        filename: 'script/main.js'
    },
    module: {
        loaders: [
            { test: /\.scss$/, loader: 'style!css!autoprefixer!sass'},
            { test: /\.js$/, exclude: /node_modules.*\.js/, loader: 'babel' },
            { test: /test[\\\/].*\.js$/, loader: 'mocha!babel'},
            { test: /\.(otf|woff|ttf)$/, loader: 'url' },
            { test: /\.(svg|gif|png|jpe?g)$/, loader: 'url?limit=5000&name=/image/[path][name].[ext]&context=public_html/image/src!img' }
        ]
    },
    devtool: 'source-map',
    watch: true
};