import Vue from '../../libs/vue';

let option = {
  template: `<div>
              <h1>c3</h1>
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
    console.log('c3 created');
  },
  mounted() {
    console.log('c3 mounted');
  },
  destroyed() {
    console.log('c3 destroyed');
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
export default option;