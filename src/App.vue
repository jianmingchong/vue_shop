<template>
  <div id="app">
    <!-- 路由占位符 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: ''
    }
  },
  methods: {
    add () {
      // vuex test
      console.log('app: ', this.$store.state.count)
      this.$store.commit('add', { num: 3 })
      console.log('app: ', this.$store.state.count)
    }
  },
  created () {
    // vuex test
    this.add()
  },
  computed: {
    // vuex test
    count () {
      return this.$store.state.count
    }
  }
}
</script>

<style>
</style>
