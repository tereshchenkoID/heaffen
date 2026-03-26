const path = require('path');
const fs = require('fs');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const PugPlugin = require('pug-plugin'); // Заменяет HtmlWebpackPlugin и MiniCssExtractPlugin
const StylelintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const config = require('./config');

const getTemplateFiles = (templateDir) => {
  const templateFiles = [];
  const readFiles = (dir) => {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        readFiles(filePath);
      } else if (path.extname(filePath) === '.pug') {
        templateFiles.push(filePath);
      }
    });
  };
  readFiles(templateDir);
  return templateFiles;
};

const getPugEntries = (templateDir) => {
  const entries = {};
  const rootDir = path.resolve(templateDir);
  const files = getTemplateFiles(rootDir);
  files.forEach((filePath) => {
    const relativePath = path.relative(rootDir, filePath);
    const entryName = relativePath.replace(/\.pug$/, '');
    entries[entryName] = filePath;
  });
  return entries;
};

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  target: 'web',

  entry: {
    app: path.resolve(__dirname, config.src.js, 'app.js'),
    ...getPugEntries(config.src.pug),
  },

  output: {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    path: path.resolve(__dirname, config.dest.root),
    clean: true,
    filename: (pathData) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      (pathData.chunk.name === 'app'
        ? `${config.dest.js}/[name].js`
        : 'js/_tmp_[name].js')
    ,
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, 'src/icons'),
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: 'img/sprite.svg',
              publicPath: '/',
            },
          },
          'svgo-loader',
        ],
      },
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                outputStyle: 'expanded',
                implementation: require.resolve('sass'),
              },
            },
          },
        ],
      },
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },
    ],
  },

  plugins: [
    new PugPlugin({
      pretty: true,
      inject: true,
      js: {
        filename: `${config.dest.js}/[name].js`,
      },
      css: {
        filename: `${config.dest.css}/[name].css`,
      },
    }),

    new SpriteLoaderPlugin({ plainSprite: true }),

    new ImageminWebpWebpackPlugin({
      detailedLogs: true,
      overrideExtension: true,
      config: [{
        test: /\.(jpe?g|png|gif)/,
        options: { quality: 75 },
      }],
    }),

    new FileManagerPlugin({
      events: {
        onStart: {
          delete: [config.dest.root],
        },
        onEnd: {
          copy: [
            {
              source: path.join(config.src.root, config.src.assets),
              destination: config.dest.root,
            },
          ],
        },
      },
      runTasksInSeries: true,
      runOnceInWatchMode: true,
    }),

    new ESLintPlugin({
      extensions: 'js',
      emitWarning: true,
      files: path.resolve(__dirname, config.src.root),
    }),

    new StylelintPlugin({
      files: path.join(config.src.scss, '**/*.s?(a|c)ss'),
    }),
  ],

  optimization: {
    minimizer: [new TerserPlugin()],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },

  resolve: {
    alias: {
      scss: path.resolve(__dirname, config.src.scss),
      js: path.resolve(__dirname, config.src.js),
    },
  },

  devServer: {
    hot: true,
    static: {
      directory: path.join(__dirname, config.dest.root),
    },
    watchFiles: [path.join(__dirname, config.src.root)],
    open: true,
  },
};
