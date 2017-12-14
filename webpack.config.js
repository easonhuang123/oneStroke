const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: '#eval-source-map',
    entry: [
       './src/main.js'
    ],
    output: {
        path: path.join(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'onestroke.js'
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/,
                include: __dirname
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        port: 8088,
        inline: true,
        hot: true
    }
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}