const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
 
  module.exports = {
    entry: {
        'app-client': './src/client/components/index.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
         library: 'AppClient', // Don't change this
         libraryExport: 'default',
         libraryTarget: 'umd',
         globalObject: 'this',
         publicPath: '',

    },
   
    module: {
        rules: [

            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
        ],
    },
  
    resolve: {
        extensions: ['.js', '.jsx'],
    },

    optimization: {
        minimizer: [
            new TerserPlugin(),
        ],
    },

    mode: 'production',
 }; 
 