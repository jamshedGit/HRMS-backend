const webpack = require('webpack'); 
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

// replace accordingly './.env' with the path of your .env file 
require('dotenv').config({ path: './.env' }); 

const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.IgnorePlugin({
      resourceRegExp: /^net$|^async_hooks$/
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env)
    }),
    
  ]
};