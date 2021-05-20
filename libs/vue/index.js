import Dep from './dep';
import Watcher from './watcher';
const loop = function() {}
class Vue {
  constructor(option) {
    this.$template = option.template;
    this.$data = this._data = option.data();
    this.$methods = option.methods;
    this.$computed = option.computed;
    this.$created = option.created || loop;
    this.$mounted = option.mounted || loop;
    this.$destroyed = option.destroyed || loop;
    this._router = option.router;
    this.__init();
  }
  __init() {
    this.__computed();
    this.__observe(this.$data);
    this.__proxyData();
    this.$created();
  }
  // 对data属性进行get和set监控
  __observe(data) {
    if(typeof data !== 'object') {
      return void 0;
    }
    for(let k in data) {
      if(typeof data[k] === 'object') { // 如果data[k]还是对象的话，进行递归操作
        this.__observe(data[k]);
      }else {
        let dep = new Dep();
        let val = data[k];
        Object.defineProperty(data, k, {
          get() {
            if(Dep.target) {
              dep.addSubscript(Dep.target);
            }
            return val;
          },
          set(newVal) {
            val = newVal;
            dep.notify();
          }
        });
      }
    }
  }
  // 对html进行解析操作，处理{{}}, v-xxx等标记
  __compile(el) {
    let vm = this;
    let childNodes = Array.from(el.childNodes);
    let exp = /\{\{(.+)\}\}/g;
    childNodes.forEach(ele=> {
      // 文本节点内容里含有{{}}
      if(ele.nodeType===3&&exp.test(ele.textContent)) {
        this.__parseTpl(vm, ele);
      }
      // 指令处理
      if(ele.nodeType===1) {
        let attributes = Array.from(ele.attributes);
        attributes.forEach(attr=> {
          // 对v-xxx属性做处理
          if(attr.name.indexOf('v-')===0) {
            let director = attr.name.slice(2);
            switch(director) {
              case 'html':
                this.__directorHtml(vm, ele, attr);
                break;
              case 'text':
                this.__directorText(vm, ele, attr);
                break;
              case 'model':
                this.__directorModel(vm, ele, attr);
                break;
            }
          }
          // 对@属性做处理
          if(attr.name.indexOf('@')===0) {
            let eventName = attr.name.slice(1);
            ele.addEventListener(eventName, vm.$methods[attr.value].bind(vm), false);
          }
        }); 
      }
      // 如果ele含有子元素，则递归循环
      if(ele.nodeType===1&&ele.childNodes.length>0) {
        this.__compile(ele);
      }
    });
    return el;
  }

  // {{}}标记符的操作
  __parseTpl(vm, ele) {
    // 这里需要new一个watcher，并放置在Dep类的target上
    let expNameArr = RegExp.$1.split('.');
    let val = vm.$data;
    let watcher = new Watcher(()=> {
      let val = vm.$data;
      for(let k in expNameArr) {
        val = val[expNameArr[k]];
      }
      ele.textContent = val;
    })
    Dep.target = watcher;
    for(let k in expNameArr) {
      val = val[expNameArr[k]];
    }
    Dep.target = null;
    ele.textContent = ele.textContent.replace(/\{\{.+\}\}/g, val);
  }
  // v-html指令操作
  __directorHtml(vm, ele, attr) {
    let epx = attr.value;
    let expNameArr = epx.split('.');
    let val = vm.$data;
    // 加依赖
    let watcher = new Watcher(()=> {
      let val = vm.$data;
      for(let k in expNameArr) {
        val = val[expNameArr[k]];
      }
      ele.innerHTML = val = val;
    })
    Dep.target = watcher;
    for(let k in expNameArr) {
      val = val[expNameArr[k]];
    }
    Dep.target = false;
    ele.innerHTML = val;
  }
  // v-text指令操作
  __directorText(vm, ele, attr) {
    let epx = attr.value;
    let expNameArr = epx.split('.');
    let val = vm.$data;
    // 加依赖
    let watcher = new Watcher(()=> {
      let val = vm.$data;
      for(let k in expNameArr) {
        val = val[expNameArr[k]];
      }
      ele.textContent = val;
    })
    Dep.target = watcher;
    for(let k in expNameArr) {
      val = val[expNameArr[k]];
    }
    Dep.target = false;
    ele.textContent = val;
  }
  // v-model指令操作
  __directorModel(vm, ele, attr) {
    let epx = attr.value;
    let expNameArr = epx.split('.');
    let val = vm.$data;
    // 加依赖
    let watcher = new Watcher(()=> {
      let val = vm.$data;
      for(let k in expNameArr) {
        val = val[expNameArr[k]];
      }
      ele.value = val;
    })
    Dep.target = watcher;
    for(let k in expNameArr) {
      val = val[expNameArr[k]];
    }
    Dep.target = false;
    ele.value = val;
    // 双向数据绑定，这里需要给ele添加input事件来改变data数据
    ele.addEventListener('input', evt=> {
      vm.$data[epx] = evt.target.value;
    }, false);
  }
  // 将$data的数据合并到vm上，也就是在vm上做一个proxy，可以直接访问$data里的数据
  __proxyData() {
    let data = this.$data;
    let vm = this;
    proxyFn(data);
    function proxyFn(data) {
      for(let k in data) {
        Object.defineProperty(vm, k, {
          get() {
            return data[k];
          },
          set(newVal) {
            data[k] = newVal;
          }
        });
      }
    }
  }
  // 处理computed计算属性
  __computed() {
    let computed = this.$computed;
    for(let k in computed) {
      Object.defineProperty(this.$data, k, {
        get() {
          return computed[k].call(this);
        }
      });
    }
  }
  // 挂在并渲染$mount
  $mount(el) {
    this.$el = el;
    let fragDocument = document.createDocumentFragment();
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.$template;
    let childNodes = tempDiv.childNodes;
    childNodes.forEach(child=> {
      fragDocument.appendChild(child);
    });
    let compileNode = this.__compile(fragDocument);
    el.appendChild(compileNode);
    this.$mounted(); // 执行mounted钩子函数
    // 挂在之后，执行router
    if(this._router) {
      this.$router.init.bind(this)();
    }
  }
  // 销毁操作，也就是从挂在节点上移除
  $destroy() {
    this.$el.childNodes.forEach(child=> {
      this.$el.removeChild(child);
    });
    this.$destroyed();
  }
}
// $use第三方库插入方法
Vue.$use = (lib)=> {
  lib&&lib.install&&lib.install(Vue);
}

export default Vue;