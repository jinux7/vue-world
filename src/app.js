import Vue from '../libs/vue';
import Router from '../libs/router';
import c1 from './components/c1';
import c2 from './components/c2';
import c3 from './components/c3';

let router = new Router({
	mode: 'history',
	routes: [
		{
			path: '/c1',
			name: 'c1',
			component: c1
		},
    {
			path: '/c2',
			name: 'c2',
			component: c2
		},
    {
			path: '/c3',
			name: 'c3',
			component: c3
		}
	]
});

let option = {
  template: `<div class="wrap">
              <div class="title">
                <h1>welcome to mini Vue</h1>
              </div>
              <div class="content">
                <div class="left">
                  <p>menu</p>
                  <ul>
                    <li>
                      <a href="/c1">c1</a>
                    </li>
                    <li>
                      <a href="/c2">c2</a>
                    </li>
                    <li>
                      <a href="/c3">c3</a>
                    </li>
                  </ul>
                </div>
                <div class="right">
                  <div id="router-view"></div>
                </div>
              </div>
            </div>`,
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
      this.$router();
    }
  },
  computed: {
    sum() {
      return this.age + 20;
    }
  },
  router
}

let vm = new Vue(option);
export default vm;
  