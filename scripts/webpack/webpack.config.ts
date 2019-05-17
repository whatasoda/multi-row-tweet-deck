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

  const ENTRY_ROOT = path.resolve(__dirname, '../../src/entries');

  return {
    entry: {
      content: path.resolve(ENTRY_ROOT, 'content.ts'),
      json: [
        path.resolve(ENTRY_ROOT, 'manifest.json.ts'),
        path.resolve(ENTRY_ROOT, '_locale/en/message.json.ts'),
        path.resolve(ENTRY_ROOT, '_locale/ja/message.json.ts'),
      ],
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
                name: (file: string): string => {
                  const { dir, name } = path.parse(path.relative(ENTRY_ROOT, file));
                  return path.join(dir, name);
                },
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
