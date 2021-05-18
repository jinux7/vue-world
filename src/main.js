import Vue from '../libs/vue';

let option = {
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
  methods: {
    onChange() {
      this.age = 30;
    }
  },
  computed: {
    sum() {
      return this.age + 20;
    }
  }
}
let vm1 = new Vue(option);
let vm2 = new Vue(option);
vm1.$mount(document.getElementById('app1'));
vm2.$mount(document.getElementById('app2'));
