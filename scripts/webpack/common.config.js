const merge = require('webpack-merge');
const webpack = require('webpack');
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const styledComponentsTransformer = createStyledComponentsTransformer({ minify: true });

const defaultOptions = { __rootdir: '', tsconfig: '' };

module.exports = (options = defaultOptions) => {
  const { tsconfig } = { ...defaultOptions, ...options };
  return merge({
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: tsconfig,
                getCustomTransformers: () => ({ before: [styledComponentsTransformer] }),
              },
            },
          ],
        },
        {
          test: /\.(png)$/,
          use: ['file-loader'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          EXTENSION_ID: JSON.stringify('cjlaagghmikageagedknpkmapcjodnno'),
        },
      }),
      new CleanWebpackPlugin(),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  });
};
