const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = env => {

    // Check environment
    if (env.ui)
        return createUI(env)
    else
        return createPlugin(env)

}

// Config for the plugin
function createPlugin(env) {

    // Create config
    let config = {
        entry: './src/index.js',
        // mode: 'development',
        mode: 'production',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'plugin.js',
            library: {
                name: 'module.exports',
                type: 'assign',
                export: 'default'
            }
        },
        module: {
            rules: []
        },
        plugins: []
    }

    // Add support for JS
    config.module.rules.push({
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader"
        }
    })

    // Add support for require()'ing resource files. These files will be bundled into
    // the plugin as a data URI. Generally you should use `this.paths.absolute()` to
    // get a path to a resource in the resources/ folder instead.
    config.module.rules.push({
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf|ico|mp3|mp4|wav|hdr|glb)$/,
        use: [
            {
                loader: 'url-loader',
                options: {
                    esModule: false,
                    limit: 100000000, 
                },
            },
        ],
    })

    // Copy all files from the resources/ folder into the dist/ folder when building
    const CopyPlugin = require("copy-webpack-plugin")
    config.plugins.push(new CopyPlugin({
        patterns: [
            { from: path.resolve(__dirname, 'resources'), to: "./" },
        ],
    }))

    // Add support for the dev server
    config.devServer = {
        static: {
            directory: path.join(__dirname, 'resources'),
        },
        compress: true,
        port: 9000,
        hot: false,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Authorization"
        }
    }

    // Done
    return config

}

// Config for a React UI component
function createUI(env) {

    // Create config
    let config = {
        plugins: [],
        module: {
            rules: []
        }
    }

    // App entry point
    config.entry = {
        app: [`./src-${env.ui}/index.js`]
    }

    // Output location
    config.output = {
        filename: '[name].[contenthash].bundle.js',
        path: path.resolve(__dirname, 'resources', 'ui-build', env.ui),
        publicPath: './'
    }

    // Add HTML page plugin
    config.plugins.push(new HtmlWebpackPlugin({
        // template: 'src/html/index.ejs',
    }))

    // Add support for JS and JSX
    config.module.rules.push({
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader"
        }
    })

    // Add support for resource files
    config.module.rules.push({
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf|ico|mp3|wav|hdr|glb|mp4|html|dds|env)$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    esModule: false // Required so that calling `require()` on a file actually works.
                },
            },
        ],
    })

    // Add support for CSS
    config.module.rules.push({
        test: /\.(css)$/,
        use: [
            { loader: 'file-loader', options: { name: '[name].css' } },
            { loader: 'extract-loader' },
            { loader: 'css-loader', options: { importLoaders: 1 } },
        ],
    })

    // Add dev server options
    config.devtool = 'inline-source-map'

    // Done
    return config

}