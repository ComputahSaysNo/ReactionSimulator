<template>
<b-navbar toggleable="lg" type="dark" variant="dark">
  <b-navbar-brand>
    Reaction Simulator
    <small class="text-primary">(v{{ version }})</small>
  </b-navbar-brand>
</b-navbar>
</template>

<script>

export default {
  name: 'Header',
  data () {
    return {
      fps: 0,
      times: [],
      version: '1.0'
    }
  },
  methods: {
  },
  mounted: function () {
  },
  computed: {
    age: function () {
      return this.$store.getters.age
    }
  }
}
</script>

<style scoped>
</style>
