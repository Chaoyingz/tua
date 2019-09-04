const path = require("path");
const Dotenv = require("dotenv-webpack");
const { version } = require("./package.json");
const { VueLoaderPlugin } = require("vue-loader");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const config = {
  mode: process.env.NODE_ENV,
  context: __dirname + "/src",
  entry: {
    background: "./background.js",
    "popup/popup": "./popup/popup.js",
    "options/options": "./options/options.js",
    "content/content": "./content/content.js"
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].js"
  },
  resolve: {
    extensions: [".js", ".vue", "json"],
    alias: {
      "@": path.resolve(__dirname, "./src/")
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loaders: "vue-loader",
        options: {
          loaders: {
            sass: ["vue-style-loader", "css-loader", "sass-loader"]
          }
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file)
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
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
        test: /\.scss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.svg$/,
        loader: "vue-svg-loader"
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      { from: "icons", to: "icons" },
      {
        from: "popup/popup.html",
        to: "popup/popup.html"
      },
      {
        from: "options/options.html",
        to: "options/options.html"
      },
      {
        from: "content/content.html",
        to: "content/content.html"
      },
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
    new Dotenv({ path: ".env.local" })
  ]
};

module.exports = config;
