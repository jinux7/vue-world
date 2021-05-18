class Watcher {
  constructor(fn) {
    this.fn = fn;
  }
  // update
  update() {
    this.fn();
  }
}

export default  Watcher;