const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src2/index.tsx",
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
      }
    ]
  },
  resolve: { 
    extensions: ['*','.js','.jsx', '.json', '.ts', '.tsx'],
  },
  output: {
    path: path.resolve(__dirname, "build/"),
    publicPath: "/build/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "build/"),
    port: 3000,
    publicPath: "http://localhost:3000/build/",
  },
  plugins: [ 
    new HtmlWebPackPlugin( {template: path.resolve(__dirname, 'src2', 'index.html')}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      "React": "react",
    }),
    new webpack.ProvidePlugin({
      "ReactDOM": "react-dom",
    }),
  ]
};