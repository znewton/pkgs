const merge = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = env => {
    const htmlWebpackPlugin = new HtmlWebpackPlugin({ template: "./src/index.html" })
    const plugins = [htmlWebpackPlugin];
    if (env && env.clean) {
        plugins.unshift(new CleanWebpackPlugin());
    }
    if (env && env.analyze) {
        plugins.push(new BundleAnalyzerPlugin());
    }

    const isProduction = env && env.production;

    return merge({
        entry: {
            main: "./src/index.ts"
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                loader: "ts-loader"
            }]
        },
        plugins,
        output: {
            filename: "[name].bundle.js",
        },
        devServer: {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            // publicPath: '/dist',
            watchOptions: {
                ignored: "**/node_modules/**",
            }
        }
    }, isProduction
        ? require("./webpack.prod")
        : require("./webpack.dev"));
};
