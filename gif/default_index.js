const Child = {
  template: '#childarea'
};

new Vue({
  el: '#app',
  data() {
    return {
      isShowing: false 
    }
  },
  methods: {
    toggleShow() {
      this.isShowing = !this.isShowing;
    }
  },
  components: {
    appChild: Child
  }
});