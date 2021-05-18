class Dep {
  constructor() {
    this.subs = [];
  }
  // 添加订阅的方法
  addSubscript(watcher) {
    this.subs.push(watcher);
  }
  // 发布的方法
  notify() {
    this.subs.forEach(sub=> {
      sub.update();
    });
  }
}

export default Dep;