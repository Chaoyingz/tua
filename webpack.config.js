const path = require("path");
const Dotenv = require("dotenv-webpack");
const { htmlPlugin } = require("./plugin");
const { version } = require("./package.json");
const { VueLoaderPlugin } = require("vue-loader");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const isDev = process.env.NODE_ENV !== "production";

const config = {
  mode: process.env.NODE_ENV,
  context: __dirname + "/src",
  entry: {
    background: "./background.js",
    popup: "./popup",
    options: "./options",
    content: "./content"
  },
  output: {
    path: __dirname + "/dist",
    filename: "js/[name].js",
    chunkFilename: "js/[name].js"
  },
  resolve: {
    extensions: [".js", ".vue", "json"],
    alias: {
      "@": path.resolve(__dirname, "./src/")
    }
  },
  stats: {
    entrypoints: false,
    children: false
  },
  performance: {
    hints: false
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loaders: "vue-loader",
        options: {
          loaders: {
            sass: [
              process.env.NODE_ENV !== "production"
                ? "vue-style-loader"
                : MiniCssExtractPlugin.loader,
              "css-loader",
              "sass-loader"
            ]
          }
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader"
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "img/[name].[ext]?[hash]"
        }
      },
      {
        test: /\.(s*)css$/,
        include: path.resolve(__dirname, "./src/content"),
        use: ["vue-style-loader", "css-loader", "postcss-loader", "sass-loader"]
      },
      {
        test: /\.(s*)css$/,
        exclude: path.resolve(__dirname, "./src/content"),
        use: [
          isDev ? "vue-style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.svg$/,
        loader: "vue-svg-loader"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      { from: "icons", to: "icons" },
      {
        from: "manifest.json",
        to: "manifest.json",
        transform: content => {
          const jsonContent = JSON.parse(content);
          jsonContent.version = version;

          if (config.mode === "development") {
            jsonContent["content_security_policy"] =
              "script-src 'self' 'unsafe-eval'; object-src 'self'";
          }

          return JSON.stringify(jsonContent, null, 2);
        }
      }
    ]),
    new Dotenv({ path: ".env.local" }),
    htmlPlugin("popup"),
    htmlPlugin("options"),
    new MiniCssExtractPlugin({
      filename: "css/[name].[chunkhash:8].css",
      chunkFilename: "css/[name].[chunkhash:8].css"
    })
  ]
};
if (process.env.ANALYZER) {
  config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
