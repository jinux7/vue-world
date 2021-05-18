import Vue from '../libs/vue';

let vm = new Vue({
  el: document.getElementById('app'),
  data() {
    return {
      name: '小明',
      age: 18,
      likes: {
        sport: '足球,篮球',
        food: '汉堡,薯条'
      },
      arr: [1, 2, 3]
    }
  },
});
window.vm = vm;
// vm.$data.arr[1] = 'ooo';
// console.log(vm.$data.name);
