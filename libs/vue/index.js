import Dep from './dep';
import Watcher from './watcher';
class Vue {
  constructor(option) {
    this.$el = option.el;
    this.$data = this._data = option.data();

    this.init();
  }
  init() {
    this.observe(this.$data);
    this.compile(this.$el);
  }
  // 对data属性进行get和set监控
  observe(data) {
    if(typeof data !== 'object') {
      return void 0;
    }
    for(let k in data) {
      if(typeof data[k] === 'object') { // 如果data[k]还是对象的话，进行递归操作
        this.observe(data[k]);
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
  compile(el) {
    let vm = this;
    let childNodes = Array.from(el.childNodes);
    let exp = /\{\{(.+)\}\}/g;
    childNodes.forEach(ele=> {
      // 文本节点内容里含有{{}}
      if(ele.nodeType===3&&exp.test(ele.textContent)) {
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
      // 对v-xxx属性做处理
      if(ele.nodeType===1) {
        let attributes = Array.from(ele.attributes);
        attributes.forEach(attr=> {
          if(attr.name.indexOf('v-')===0) {
            let director = attr.name.slice(2);
            let epx = attr.value;
            
            console.log(director);
          }
        });      
      }
      
      if(ele.nodeType===1&&ele.childNodes.length>0) {
        this.compile(ele);
      }
    });
  }
}

export default Vue;