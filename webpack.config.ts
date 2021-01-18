import nodeExternals from "webpack-node-externals"
import path from 'path'

export default {
    entry:{
        index: "./src/main.ts",
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        libraryTarget: "commonjs2"
    },
    mode:"production",
    target: "node",
    externals: [nodeExternals()],
    module:{
        rules: [
            {
              test: /\.ts$/,
              loader: 'ts-loader',
            }
        ]
    },
    optimization:{
        splitChunks: false,
        minimize: false

    },
    resolve: {
        extensions: ['.ts', '.json'],
        alias: {
          '@': path.resolve('src'),
        }
    }
}