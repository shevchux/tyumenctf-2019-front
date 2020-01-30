const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

module.exports = {
  entry: ["@babel/polyfill", "./index.jsx"],
  context: path.resolve(__dirname, "src"),
  output: {
    filename: "js/bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    minimizer: isProd ? [
      new TerserJSPlugin({}),
      new OptimizeCssAssetsPlugin({}),
    ] : undefined,
  },
  devServer: {
    port: 5000,
  },
  devtool: isDev ? "source-map" : "",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: { 
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.s?css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: "../",
            hmr: isDev,
            reloadAll: true,
          }
        }, "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 20,
            fallback: "file-loader",
            name: "[name].[ext]",
            outputPath: (url, resourcePath) => {
              if (/Pic_\d+\.gif/.test(resourcePath)) {
                return `images/logo/${url}`;
              }
  
              return `images/${url}`;
            },
          },
        },
      },
      {
        test: /\.mp3$/,
        use: {
          loader: "file-loader",
          options: {
            name: "sounds/[name].[ext]",
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html",
      hash: true,
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
    new CopyWebpackPlugin([
      "favicon.ico",
      {
        from: "assets/logo",
        to: "images/logo"
      },
      {
        from: "containers/WindowContainer/DosGameWindow/games",
        to: "games"
      }
    ]),
    new BundleAnalyzerPlugin({
      analyzerMode: isProd ? "server" : "disabled",
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".json", ".png", ".html", ".scss", "*"],
  },
};
