const path = require("path");
const merge = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = env => {
    const htmlWebpackPlugin = new HtmlWebpackPlugin({ template: "./src/index.html" })
    const plugins = env && env.clean
        ? [new CleanWebpackPlugin(), htmlWebpackPlugin]
        : [htmlWebpackPlugin];

    const isProduction = env && env.production;

    return merge({
        entry: {
            main: "./src/app.ts"
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
            // path: path.resolve(__dirname, "dist"),
            // library: "[name]",
            // https://github.com/webpack/webpack/issues/5767
            // https://github.com/webpack/webpack/issues/7939
            // devtoolNamespace: "znewton/fluid-app",
            // This is required to run webpacked code in webworker/node
            // https://github.com/webpack/webpack/issues/6522
            // globalObject: "(typeof self !== 'undefined' ? self : this)",
            // libraryTarget: "umd"
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
