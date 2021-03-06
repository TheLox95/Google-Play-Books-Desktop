const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  target: "electron-main",
  entry: "./src/index.tsx",
  mode: "development",
  devtool: 'source-map', 
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components|views|test)/,
        loader: "ts-loader"
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
            }
        }]
      },
      {
        test: /\.png$/, 
        loader: 'file-loader?name=images/[name].[ext]',
      },
    ]
  },
  resolve: { 
    extensions: ['*','.js','.jsx', '.json', '.ts', '.tsx'],
  },
  output: {
    path: path.resolve(__dirname, "build/"),
    publicPath: "./",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "build/"),
    port: 4545,
    publicPath: "http://localhost:4545/build/",
  },
  plugins: [ 
    new HtmlWebPackPlugin( {template: path.resolve(__dirname, 'src', 'index.html')}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      "React": "react",
    }),
    new webpack.ProvidePlugin({
      "ReactDOM": "react-dom",
    }),
  ]
};