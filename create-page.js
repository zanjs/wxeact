/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-10-11
 * @author Liang <liang@maichong.it>
 */

'use strict';

import setValue from 'lodash/set';
import getValue from 'lodash/get';
import * as utils from './utils';

/**
 * 构建列表数据项
 * @param list   原始列表
 * @param item   新列表
 * @returns {{_: *}}
 */
function buildListItem(list, item) {
  if (list && list.length && item.__k !== undefined) {
    for (let t of list) {
      if (t.__k !== undefined && t.__k === item.__k) {
        return Object.assign({}, t, item);
      }
    }
  }
  return item;
}

module.exports = function createPage(ComponentClass) {
  let config = {};
  let page;

  config.data = {};
  config.name = '';

  config._dispatch = function(event) {
    let com = this.root;
    let target = event.currentTarget || event.target;
    let path = target.dataset.path || '';
    // $Flow
    let handler =
      target.dataset['bind' + event.type] ||
      target.dataset['catch' + event.type] ||
      target.dataset[event.type];
    while (path) {
      let index = path.indexOf('.');
      let key = '';
      if (index === -1) {
        key = path;
        path = '';
      } else {
        key = path.substr(0, index);
        path = path.substr(index + 1);
      }
      com = com._children[key];
      if (!com) {
        console.error(
          'Can not resolve component by path ' + target.dataset.path
        );
        return undefined;
      }
    }
    // $Flow 我们知道com在这里一定是一个组件，而非组件数组，但是Flow不知道
    if (com[handler]) {
      if (__DEV__) {
        // $Flow
        console.log('%c%s %s(%o)', 'color:#2abb40', com.id, handler, event);
      }
      return com[handler](event);
    }
    // $Flow 我们知道com在这里一定是一个组件，而非组件数组，但是Flow不知道
    console.error('Can not resolve event handle ' + com.id + '#' + handler);
    return undefined;
  };

  [
    'onRouteEnd',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom'
  ].forEach(function(name) {
    config[name] = function(...args) {
      utils.callLifecycle(this.root, name, args);
    };
  });

  config.onLoad = function(options) {
    page = this;
    page.page = page;
    page._show = false;
    page._ready = false;
    page._loadOptions = options;

    page.updateData = function(newData) {
      let data = page.data;

      Object.keys(newData).forEach(path => {
        let dataMap = newData[path];
        if (Array.isArray(dataMap)) {
          // 如果是组件列表，需要与之前列表数据合并，这样主要为了在子组件嵌套情况下，不丢失底层子组件数据
          let list = getValue(data, path); //原有data中列表数据
          let newList = dataMap.map(item => buildListItem(list, item));
          setValue(data, path, newList);
        } else {
          setValue(data, path.split('.'), dataMap);
        }
      });

      page.setData(data);
    };

    let root = (page.root = new ComponentClass({}));
    root._config = {};
    root.page = page;

    root.id = page.__route__;
    root.page = page;
    try {
      root._init('');
    } catch (error) {
      console.error(error.stack);
    }
    if (root.onLoad) {
      root.onLoad(options);
    }
  };

  config.onReady = function() {
    page._ready = true;
    utils.callLifecycle(this.root, 'onReady');
  };

  config.onShow = function() {
    page._show = true;
    utils.callLifecycle(this.root, 'onShow');
  };

  config.onHide = function() {
    page._show = false;
    utils.callLifecycle(this.root, 'onHide');
  };

  if (ComponentClass.prototype.onShareAppMessage) {
    config.onShareAppMessage = function() {
      let share = this.root.onShareAppMessage();
      if (__DEV__ && !share) {
        console.error(this.root.id + ' onShareAppMessage() 没有返回分享数据');
      }
      return share;
    };
  }

  return config;
};
