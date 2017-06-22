// wxeact的配置文件

module.exports = {
  define: {
    API_ROOT: 'http://localhost:5000/'
  },
  npmMap: {
    'lodash.isplainobject': 'lodash/isPlainObject',
    'lodash.isstring': 'lodash/isString',
    'lodash.issymbol': 'lodash/isSymbol',
    'lodash-es': 'lodash'
  },
  uglify: {
    mangle: [],
    compress: {
      warnings: false
    }
  },
  classNames: {
    'todo-finished': true,
    'todo-finished-title': true,
    'btn-gray-hollow': true,
    'btn-danger': true
  },
  env: {
    development: {},
    production: {
      define: {
        API_ROOT: 'https://your.online.domain/'
      }
    }
  }
};
