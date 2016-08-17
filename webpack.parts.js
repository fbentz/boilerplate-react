const path = require("path");
const webpack = require("webpack");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

exports.html = function html() {
  return {
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src", "assets", "index.html")
      })
    ]
  };
};

exports.setFreeVariable = function setFreeVariable(key, value) {
  const env = {};
  env[key] = JSON.stringify(value);
  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  };
};

exports.minify = function minify() {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  };
};

exports.clean = function clean(path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        root: process.cwd()
      })
    ]
  };
};

exports.extractBundle = function extractBundle() {
  return {
    plugins: [
      new webpack.optimize.CommonsChunkPlugin("vendor", "[name].[chunkhash].js")
    ]
  };
};

exports.extractCSS = function extractCSS(paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract("style", "css!postcss-loader"),
          include: paths
        }
      ]
    },
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin("[name].[chunkhash].css")
    ],
    postcss: function (webpack) {
      return [
        require("postcss-import")({ addDependencyTo: webpack }),
        require("postcss-url")(),
        require("postcss-cssnext")(),
        require("postcss-browser-reporter")(),
        require("postcss-reporter")(),
      ]
    }
  };
};

exports.setupCSS = function(paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ["style", "css", "postcss"],
          include: paths
        }
      ]
    },
    postcss: function (webpack) {
      return [
        require("postcss-import")({ addDependencyTo: webpack }),
        require("postcss-url")(),
        require("postcss-cssnext")(),
        require("postcss-browser-reporter")(),
        require("postcss-reporter")(),
      ]
    }
  };
};

exports.hmr = function hmr() {
  return {
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ]
  };
};