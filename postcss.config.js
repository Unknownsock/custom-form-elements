module.exports = (api) => ({
	plugins: [
		require('autoprefixer'),
		api.mode === 'production' && require('cssnano')({ preset: 'default' }),
	].filter(Boolean),
});
