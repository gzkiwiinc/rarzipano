const path = require('path');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const EsmWebpackPlugin = require("@purtuga/esm-webpack-plugin");
const baseConfig = require('./webpack.base.conf.js');

const prodConfig = {
  mode: 'production',
  entry: path.join(__dirname, '..', 'src/index.ts'),
  output: {
    path: path.join(__dirname, '..', 'lib/'),
    filename: "index.js",
    library: 'rarzipano',
    libraryTarget: 'var',
    // libraryExport: 'default',
  },
  resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
	},
  externals: [nodeExternals()],
  plugins: [
    new EsmWebpackPlugin()
  ]
}

module.exports = merge(baseConfig, prodConfig)