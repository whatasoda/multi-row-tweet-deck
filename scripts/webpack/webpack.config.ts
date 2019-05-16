import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import { Configuration, Loader } from 'webpack';

export default (): Configuration => {
  const loaders = (<K extends string>(r: Record<K, Loader>) => r)({
    tsLoader: {
      loader: 'ts-loader',
      options: { transpileOnly: true },
    },
  });

  return {
    entry: {
      content: path.resolve(__dirname, '../../src/entries/content.ts'),
      json: [path.resolve(__dirname, '../../src/entries/manifest.json.ts')],
    },
    output: {
      path: path.resolve(__dirname, '../../dist'),
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        tslint: true,
        memoryLimit: 4096,
        useTypescriptIncrementalApi: false,
        workers: ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /\.json\.ts$/,
          use: [loaders.tsLoader],
        },
        {
          test: /\.json\.ts$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name]',
              },
            },
            'val-loader',
            loaders.tsLoader,
          ],
        },
      ],
    },
  };
};
