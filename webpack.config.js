const path = require('path');
const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');

const actId = (process.env.ACT_ID || process.env.npm_config_actId || '').toString().trim();
const baseDir = __dirname;
const buildSrcDir = actId
    ? path.join(baseDir, 'userModules', actId, 'build_src')
    : path.join(baseDir, 'build_src');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isUserBuild = !!actId;
  const entryName = isUserBuild ? `jmicro.h5.${actId}` : 'jmicro.h5';
  
  if (!entryName) {
    throw new Error('Webpack entry name is empty. Check ACT_ID configuration.');
  }
  
  const entryPath = path.join(buildSrcDir, 'index.js');
  if (!fs.existsSync(entryPath)) {
    throw new Error(`Webpack entry file not found: ${entryPath}`);
  }
  
  const entry = {};
  entry[entryName] = entryPath;
  
  return {
    // 入口文件
    entry,
    
    // 输出配置
    output: {
      path: isUserBuild
        ? path.resolve(baseDir, 'userModules', actId)
        : path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].min.js' : '[name].js',
      library: {
        name: 'JMicroSrvItem',
        type: 'umd',
        export: 'default',
        umdNamedDefine: true
      },
      globalObject: 'typeof self !== \'undefined\' ? self : this',
      clean: false
    },
    
    // 模块解析规则
    resolve: {
      extensions: ['.js', '.json'],
      alias: {
        '@': buildSrcDir
      }
    },
    
    // 模块加载规则
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['> 1%', 'last 2 versions', 'not dead']
                  },
                  modules: false  // 保留 ES6 模块语法，让 webpack 处理
                }]
              ]
            }
          }
        }
      ]
    },
    
    // 优化配置
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction,  // 生产环境移除 console
              drop_debugger: isProduction
            },
            output: {
              comments: false,  // 移除注释
            }
          },
          extractComments: false
        })
      ],
      // 将重复的模块合并
      splitChunks: {
        chunks: 'all',
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    
    // 性能提示
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    
    // 生成 source map（便于调试）
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    
    // 模式
    mode: isProduction ? 'production' : 'development',
    
    // 目标环境
    target: ['web', 'es5']
  };
};