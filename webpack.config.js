const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
	const isProd = (argv.mode || 'production') === 'production';

	return {
		mode: isProd ? 'production' : 'development',
		devtool: isProd ? false : 'source-map',
		entry: {
			'custom-form-elements.min': './src/index.js',
		},
		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, 'dist'),
			clean: true,
			library: {
				name: 'CustomFormElements',
				type: 'umd',
			},
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: 'babel-loader',
				},
				{
					test: /\.scss$/,
					use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
				},
			],
		},
		plugins: [new MiniCssExtractPlugin({ filename: '[name].css' })],
	};
};
