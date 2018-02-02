const path = require( 'path' );
const fs = require( 'fs' );
const webpack = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const FaviconsWebpackPlugin = require( 'favicons-webpack-plugin' );
const chalk = require( 'chalk' );

const help = require( './config/helper' );

let preprocessor = null;
let bootstrap = 4;
let pingue_cli_config;
try {
  pingue_cli_config = JSON.parse( fs.readFileSync( help.root( 'pingue_cli.json' ), 'utf8' ) );
  preprocessor = pingue_cli_config.preprocessor;
  bootstrap = pingue_cli_config.bootstrap;
} catch ( e ) {
  console.log( 'No pingue_cli.json' );
}

const ENV = process.env.NODE_ENV;
const bootstraprcCustomLocation = `config/.bootstraprc-${bootstrap}`;
const ENV_msg = ENV === 'prod' ? 'PRODUCTION' : ( ENV === 'dev' ? 'DEVELOPMENT' : 'TEST');

console.log( `${chalk.underline('Running in Environment:')} ${chalk.bold.green(ENV_msg)}` );

process.noDeprecation = true;

module.exports = function () {
  return {
    context: help.root( 'src/' ),

    entry: {
      index: [ './index.ts' ],
    },

    output: {
      path: help.root( 'build' ),
      publicPath: '/'
    },

    resolve: {
      extensions: [ '.ts', '.js', '.json' ]
    },

    module: {
      noParse: /\/node_modules\/(jquery|lodash|moment)/,
      rules: [
        {
          test: /\.ts$/,
          loaders: [ 'awesome-typescript-loader' ],
          include: help.root( 'src' )
        },
        {
          test: /\.ts$/,
          enforce: 'pre',
          loader: 'tslint-loader',
          options: {
            configFile: 'tslint.json',
            tsConfigFile: 'tsconfig.json'
          }
        },
      ]
    },

    plugins: [
      new HtmlWebpackPlugin( {
        filename: 'index.html',
        chunks: [ 'common', 'vendor', 'bootstrap', 'manifest', 'index' ],
        template: help.root( 'src/index.html' )
      } ),
      new webpack.NamedModulesPlugin(),
      new webpack.DefinePlugin( {
        'process.env': {
          NODE_ENV: JSON.stringify( ENV )
        }
      } ),
      new webpack.ContextReplacementPlugin( /node_modules\/moment\/locale/, /pl|en-gb/ ),
    ],

    devtool: 'source-map'
  };

};
