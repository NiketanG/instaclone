const webpack = require("webpack");
const path = require("path");
const {
	addExternalBabelPlugin,
	override,
	addBabelPreset,
	fixBabelImports,
	babelInclude,
	addWebpackAlias,
} = require("customize-cra");

const addConfig = (config) => {
	config.plugins.push(new webpack.DefinePlugin({ __DEV__: true }));

	config.module.rules.push({
		test: /\.(js|tsx?)$/,
		// exclude: /node_modules[/\\](?!react-native-vector-icons)/,
		use: {
			loader: "babel-loader",
			options: {
				// Disable reading babel configuration
				babelrc: false,
				configFile: false,

				// The configration for compilation
				presets: [
					"@babel/preset-env",
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
	});

	config.resolve.alias = {
		"react-native$": require.resolve("react-native-web"),
	};

	config.module.rules.push({
		test: /\.(jpg|png|woff|woff2|ttf|eot|svg)$/,
		loader: "file-loader",
	});

	config.module.rules.push({
		test: /\.ttf$/,
		loader: "url-loader", // or directly file-loader
		include: path.resolve(
			__dirname,
			"node_modules/react-native-vector-icons"
		),
	});

	return config;
};

module.exports = override(
	addConfig,
	fixBabelImports("module-resolver", {
		alias: {
			"^react-native$": "react-native-web",
		},
	}),
	addWebpackAlias({
		"react-native": "react-native-web",
	}),
	babelInclude([
		path.resolve("src"),
		path.resolve("node_modules/react-native-animatable"),
	]),
	addBabelPreset("@babel/preset-react"),
	addBabelPreset("@babel/preset-flow"),
	addBabelPreset("@babel/preset-typescript"),
	addExternalBabelPlugin("@babel/plugin-proposal-class-properties")
);
