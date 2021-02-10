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
