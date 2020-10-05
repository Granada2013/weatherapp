'use strict';

let path = require('path');

module.exports = {
  mode: 'production',
  entry: './js/main.js',
  output: {
    filename: 'script.js',
    path: __dirname + '/js'
  },
  watch: true,

  devtool: "source-map",

  module: {}
};
