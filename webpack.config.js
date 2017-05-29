let webpack = require('webpack');
let isProd = process.env.NODE_ENV === 'production';
let port = process.env.PORT || '8080';
module.exports = {
  // the entry file for the bundle
  
    entry: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './client/src/app.jsx'].filter(x=>x),
    output: { 
        path: '/',
        publicPath: 'http://localhost:' + port + '/js',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: { presets: ['es2015', 'react'] }
            },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.png$/, loader: "url" },
            { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' }
        ]
    },
    plugins: [
        isProd ? new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }) : function() {},
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: "jquery"
        })
    ],
    devtool: !isProd && 'source-map',
    // start Webpack in a watch mode, so Webpack will rebuild the bundle on changes
    watch: true
};
