const path = require("path");

module.exports = {
	mode: "development",

	// Path to the entry file, change it according to the path you have
	entry: path.join(__dirname, "App.js"),

	// Path for the output files
	output: {
		path: path.join(__dirname, "dist"),
		filename: "app.bundle.js",
	},

	// Enable source map support
	devtool: "source-map",

	// Loaders and resolver config
	module: {
		rules: [
			{
				test: /\.(js|tsx?)$/,
				exclude: /node_modules[/\\](?!react-native-vector-icons)/,
				use: {
					loader: "babel-loader",
					options: {
						// Disable reading babel configuration
						babelrc: false,
						configFile: false,

						// The configuration for compilation
						presets: [
							["@babel/preset-env", { useBuiltIns: "usage" }],
							"@babel/preset-react",
							"@babel/preset-flow",
							"@babel/preset-typescript",
						],
						plugins: [
							"@babel/plugin-proposal-class-properties",
							"@babel/plugin-proposal-object-rest-spread",
						],
					},
				},
			},
			{
				test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
				loader: "file-loader",
			},
		],
	},
	resolve: {
		alias: {
			"react-native$": require.resolve("react-native-web"),
		},
	},

	// Development server config
	devServer: {
		contentBase: [path.join(__dirname, "public")],
		historyApiFallback: true,
	},
};
