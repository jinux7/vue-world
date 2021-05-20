class Router {
  constructor(option) {
    this.$routes = option.routes || [];
    this.$mode = option.mode || 'hash'
  }
}
Router.install = (Vue)=> {
  // hash模式相关 开始
  let currentComponent = null;
  function handleRouter(e) {
    const url = window.location.href;
    const hash = url.split('#').pop();
    let nRouterView = this.$el.querySelector('#router-view');
    let route = this._router.$routes.filter(item=> {
      return item.name === hash;
    })[0];
    route = route || this._router.$routes[0]; // 当前hash没有匹配到routes里定义的配置，使用第一个
    let componentOption = route&&route.component; // 获取当前hash所对应的组件配置
    currentComponent&&currentComponent.$destroy(); // 销毁之前的组件
    currentComponent = componentOption&&(new Vue(componentOption)); // 将当前hash对应的组件赋给currentComponent
    currentComponent&&currentComponent.$mount(nRouterView);
  };
  // hash模式相关 结束
  // 更改url的hashName
  function changeHash(hashName) {
    window.location.hash = hashName;
  }
  // history页面跳转
  function pageDirect(route) {
    window.history.pushState({ name: route.name }, null , route.name);
    let nRouterView = this.$el.querySelector('#router-view');
    let componentOption = route.component;
    currentComponent&&currentComponent.$destroy(); // 销毁之前的组件
    currentComponent = componentOption&&(new Vue(componentOption)); // 将当前hash对应的组件赋给currentComponent
    currentComponent&&currentComponent.$mount(nRouterView);

  }
  Vue.prototype.$router = {
    push(option) {
      changeHash(option.name);
    },
    init() {
      let self = this;
      if(self._router.$mode === 'hash') { // hash模式
        handleRouter.bind(this)();
        window.addEventListener('hashchange', handleRouter.bind(this));
      }else { // history模式
        // 默认页面加载显示
        let pathName = window.location.pathname.split('/').pop();
        let route = self._router.$routes.filter(item=> {
          return item.name === pathName; 
        })[0];
        route = route || self._router.$routes[0]; // 没有匹配到则显示第一个路由
        pageDirect.bind(self)(route);
        window.onpopstate = function (e) {
          const historyName = e.state && e.state.name || '';
          let nRouterView = self.$el.querySelector('#router-view');
          let route = self._router.$routes.filter(item=> {
            return item.name === historyName; 
          })[0];
          let componentOption = route.component;
          currentComponent&&currentComponent.$destroy(); // 销毁之前的组件
          currentComponent = componentOption&&(new Vue(componentOption)); // 将当前hash对应的组件赋给currentComponent
          currentComponent&&currentComponent.$mount(nRouterView);
        }
      }
      
      // 禁止掉a标签的默认跳转
      document.addEventListener('click', e => {
        if(e.target.tagName !== 'A') return;
        e.preventDefault();
        const href = e.target.getAttribute('href');
        if(!href) return;
        if(self._router.$mode === 'hash') { // hash模式
          const hashName = href.split('/').pop();
          changeHash(hashName);
        }else { // history模式
          const historyName = href.split('/').pop();
          let route = self._router.$routes.filter(item=> {
            return item.name === historyName; 
          })[0];
          if(route) {
            pageDirect.bind(self)(route);
          }
        }
      });
    }
  };
  Vue.prototype.$route = ()=> {
    console.log('route');
  }
}
export default Router;