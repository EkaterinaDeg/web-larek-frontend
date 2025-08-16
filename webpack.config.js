// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DefinePlugin } = require('webpack');
const Dotenv = require('dotenv-webpack');
const TerserPlugin = require("terser-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
  entry: "./src/index.ts",
  devtool: isProduction ? "source-map" : "eval-source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true, // Очищает папку dist перед каждой сборкой
    filename: isProduction ? "[name].[contenthash].js" : "[name].js",
  },
  devServer: {
    open: true,
    host: "localhost",
    watchFiles: ["src/**/*.html"],
    hot: true,
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/pages/index.html",
      minify: isProduction,
    }),
    new MiniCssExtractPlugin({
      filename: isProduction ? "[name].[contenthash].css" : "[name].css",
    }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    new Dotenv({
      path: path.resolve(__dirname, '.env'), // Используем относительный путь
      systemvars: true, // Берем переменные и из системы
      safe: true, // Не падать, если .env файла нет
      defaults: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: ["babel-loader", "ts-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          stylesHandler,
          "css-loader",
          "postcss-loader",
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sassOptions: {
                includePaths: ["src/scss"],
              },
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[hash][ext][query]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
    alias: {
      '@': path.resolve(__dirname, 'src'), // Добавляем алиас для удобства импортов
    },
  },
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: isProduction, // Удаляем console.log в production
          },
          keep_classnames: true,
          keep_fnames: true,
        },
        extractComments: false, // Не создавать файл с комментариями
      }),
    ],
    splitChunks: {
      chunks: 'all', // Разделяем vendor и app код
    },
  },
  performance: {
    hints: isProduction ? "warning" : false, // Предупреждения о размере бандла
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};