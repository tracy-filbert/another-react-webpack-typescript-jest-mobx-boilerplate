const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const paths = {
    distFolder: path.resolve(__dirname, 'dist_dev'),
    assetsFolder: path.resolve(__dirname, 'assets'),
}

module.exports = {
    mode: 'development',
    entry: {
        app: ['./src/index.tsx'],
        react: ['react', 'react-dom']
    },
    output: {
        publicPath: '/',
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[name].[chunkhash:8].js',
        path: paths.distFolder,
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'cheap-module-source-map',
    // Target environment
    target: 'web',

    resolve: {
        // Resolve module requests (default)
        modules: ['node_modules'],
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                enforce: 'pre',
                use: [
                {
                    options: {
                    formatter: 'stylish',
                    },
                    loader: require.resolve('tslint-loader'),
                }
                ]
            },
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            },
             // Load CSS files as modules and generate typing files for TS
            {
                test: /\.less$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 3
                        },
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            // Necessary for external CSS imports to work
                            // https://github.com/facebookincubator/create-react-app/issues/2677
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9', // React doesn't support IE8 anyway
                                    ],
                                    flexbox: 'no-2009',
                                }),
                            ],
                        },
                    },
                    {
                        loader: require.resolve('less-loader'),
                    },
                ]
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'hasPresence': false,
        }),
        new CleanWebpackPlugin([paths.distFolder]),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],

    devServer: {
        contentBase: paths.assetsFolder,
        index: 'index.html',
        hot: true
    },
};
