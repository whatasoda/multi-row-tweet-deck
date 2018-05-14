import * as Webpack from 'webpack'
const RULES: Webpack.Rule[]    = []

RULES.push({
  exclude: /svg/,
  test: /\.scss/,
  use: [
    { loader: 'style-loader' },
    {
      loader: 'css-loader',
      options: {
        importLoaders: 2 /* postcss-loader, sass-loader */  },
    },
    {
      loader: 'sass-loader',
      options: { sourceMap: false }
    }
  ],
})



RULES.push({
  test: /\.svg$/,
  exclude: /node_modules/,
  include: /svg/,
  loader: 'svg-react-loader',
  query: { xmlnsTest: /^xmlns.*$/ }
})



RULES.push({
  exclude: /svg/,
  test: /\.tsx?$/,
  loader: 'ts-loader'
})

export default RULES
