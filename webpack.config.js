const path = require("path");
const validate = require("webpack-validator");
const merge = require("webpack-merge");

const parts = require("./webpack.parts.js");

const TARGET = process.env.npm_lifecycle_event;

process.env.BABEL_ENV = TARGET;

const pkg = require("./package.json");

let config;

const PATHS = {
  app: path.join(__dirname, "src", "js"),
  style: path.join(__dirname, "src", "assets", "main.css"),
  build: path.join(__dirname, "dist")
};

const common = {
  entry: {
    app: PATHS.app,
    style: PATHS.style,
    vendor: Object.keys(pkg.dependencies)
  },
  output: {
    path: PATHS.build,
    filename: "[name].js",
    publicPath: "/"
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)?$/,
        loaders: ["babel?cacheDirectory"],
        exclude: /node_modules/,
        include: [
          PATHS.app
        ]
      },
      {
        test: /\.(ico|jpe?g|png|gif|svg)$/,
        loader: "file?name=[path][name].[hash].[ext]&context=src/",
        include: PATHS.images
      },
      {
        test: /\.json$/,
        loaders: [
          "json",
        ],
      },
    ]
  },
  resolve: {
    extensions: ["", ".js", ".jsx"]
  }
};


switch (process.env.npm_lifecycle_event) {
  case "build":
    config = merge(
      common,
      parts.clean(PATHS.build),
      parts.html(),
      {
        devtool: "source-map",
        output: {
          path: PATHS.build,
          filename: "[name].[chunkhash].js",
          chunkFilename: "[chunkhash].js"
        }
      },
      parts.extractBundle(),
      parts.setFreeVariable("process.env.NODE_ENV", "production"),
      parts.minify(),
      parts.extractCSS(PATHS.style)
    );
    break;
  case "start":
    config = merge(
      common,
      {
        entry: [
          "webpack-hot-middleware/client",
          common.entry.app,
          common.entry.style
        ]
      },
      parts.html(), 
      {
        devtool: "eval"
      },
      parts.setFreeVariable(
        "process.env.NODE_ENV",
        "development"),
      parts.hmr(),
      parts.setupCSS(PATHS.style)
    );
    break;
  default:
}


module.exports = validate(config);

