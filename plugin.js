const HtmlWebpackPlugin = require("html-webpack-plugin");

exports.htmlPlugin = name =>
  new HtmlWebpackPlugin({
    title: "tua translate",
    hash: true,
    cache: true,
    inject: "body",
    filename: `./pages/${name}.html`,
    template: "../public/index.html",
    chunks: [name]
  });
