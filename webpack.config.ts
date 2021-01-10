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
    mode:"development",
    target: "node",
    externals: [nodeExternals({ allowlist: /\.(css|vue)$/ })],
    module:{
        rules: [
            {
              test: /\.ts$/,
              loader: 'ts-loader'
            }
        ]
    },
    optimization:{
        splitChunks: false,
        minimize: false

    },
    resolve: {
        extensions: ['.ts', '.vue', '.json'],
        alias: {
          //'vue$': 'vue/dist/vue.esm.js',
          '@': path.resolve('src'),
        }
    }
}