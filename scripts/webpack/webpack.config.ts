import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { Configuration, Loader } from 'webpack';

const __DEV__ = process.env.NODE_ENV !== 'production';

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
      content: path.resolve(ENTRY_ROOT, 'content.tsx'),
      json: [
        path.resolve(ENTRY_ROOT, 'manifest.json.ts'),
        path.resolve(ENTRY_ROOT, '_locales/en/messages.json.ts'),
        path.resolve(ENTRY_ROOT, '_locales/ja/messages.json.ts'),
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
      new MiniCssExtractPlugin({
        filename: 'style.css',
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
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: __DEV__,
                importLoaders: 1,
              },
            },
            'sass-loader',
          ],
        },
      ],
    },
  };
};
