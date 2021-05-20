import Vue from '../../libs/vue';

let option = {
  template: `<div>
              <div class="div1" v-html="name"></div>
              <div class="div2" v-text="likes.food"></div>
              <input type="text" v-model="name">
              <div class="div2">
                <strong>
                  {{name}}
                </strong>
                <span>
                  {{sum}}
                </span>
              </div>
              <button @click="onChange1">点击修改值</button>
              <button @click="onChange2">点击跳转至c2</button>
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
  created() {
    console.log('c1 created');
  },
  mounted() {
    console.log('c1 mounted');
  },
  destroyed() {
    console.log('c1 destroyed');
  },
  methods: {
    onChange1() {
      this.age = 30;
    },
    onChange2() {
      this.$router.push({
        name: 'c2'
      });
    }
  },
  computed: {
    sum() {
      return this.age + 20;
    }
  }
}
// let vm = new Vue(option);
export default option;