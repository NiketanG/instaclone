module.exports = {
	presets: ["module:metro-react-native-babel-preset"],
	plugins: [
		"@babel/plugin-proposal-export-namespace-from",
		"react-native-reanimated/plugin",
	],
	env: {
		production: {
			plugins: [
				"@babel/plugin-proposal-export-namespace-from",
				"react-native-reanimated/plugin",
				"react-native-paper/babel",
			],
		},
	},
};
