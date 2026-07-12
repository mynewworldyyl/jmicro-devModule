const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    // 入口文件
    entry: {
      'jmicro.h5': './build_src/index.js',
      // 如果需要单独导出精简版，可以取消注释
      // 'jmicro-srvitem.min': './build_src/index.js'
    },
    
    // 输出配置
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].min.js' : '[name].js',
      // 输出为 UMD 格式，兼容多种模块系统
      library: {
        name: 'JMicroSrvItem',  // 全局变量名
        type: 'umd',
        export: 'default',
        umdNamedDefine: true
      },
      globalObject: 'typeof self !== \'undefined\' ? self : this',
      clean: true  // 打包前清空输出目录
    },
    
    // 模块解析规则
    resolve: {
      extensions: ['.js', '.json'],
      alias: {
        // 如果需要，可以设置别名
        '@': path.resolve(__dirname, 'build_src')
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