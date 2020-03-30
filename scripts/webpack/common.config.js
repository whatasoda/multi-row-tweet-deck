const merge = require('webpack-merge');
const webpack = require('webpack');
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
require('ts-node').register();

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
          exclude: /(node_modules|\.json\.ts$)/,
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
          test: /\/_jsons\/.+\.json\.ts$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'file-loader',
              options: { name: (n) => n.split('/_jsons/')[1].replace(/\.tsx?$/, '') },
            },
            'val-loader',
            'ts-loader',
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
    ],
  });
};
