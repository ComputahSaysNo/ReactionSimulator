<template>
<div id="status" class="bg-dark">
  <b-container fluid>
    <b-row class="py-1">
      <b-badge pill variant="info" class="w-100">FPS: {{ fps }}</b-badge>
    </b-row>
    <b-row class="py-1">
      <b-badge pill variant="warning" class="w-100">Sim Age: {{ age }}</b-badge>
    </b-row>
    <b-row class="py-1">
      <b-badge pill variant="danger" class="w-100">Speed: {{ speed }}x</b-badge>
    </b-row>
    <b-row class="py-1">
      <b-badge pill variant="info" class="w-100">Total KE: {{ ke }}</b-badge>
    </b-row>
    <br>
    <b-row>
      <small class="text-light">Composition</small>
    </b-row>
    <b-row class="py-1">
      <b-badge pill variant="danger" class="w-100">A: {{ comp.a }}</b-badge>
    </b-row>
    <b-row class="py-1">
      <b-badge pill variant="success" class="w-100">B: {{ comp.b }}</b-badge>
    </b-row>
    <b-row class="py-1">
      <b-badge pill variant="info" class="w-100">C: {{ comp.c }}</b-badge>
    </b-row>
    <b-row class="py-1">
      <b-badge pill variant="warning" class="w-100">D: {{ comp.d }}</b-badge>
    </b-row>
  </b-container>
</div>
</template>

<script>
export default {
  name: 'Status',
  data () {
    return {
      fps: 0,
      times: []
    }
  },
  methods: {
    refreshFPS: function () {
      window.requestAnimationFrame(() => {
        const now = performance.now()
        while (this.times.length > 0 && this.times[0] <= now - 1000) {
          this.times.shift()
        }
        this.times.push(now)
        this.fps = this.times.length
        this.refreshFPS()
      })
    }
  },
  mounted: function () {
    this.refreshFPS()
  },
  computed: {
    age: function () {
      return this.$store.getters.age
    },
    speed: function () {
      return this.$store.getters.speed
    },
    comp: function () {
      return this.$store.getters.comp
    },
    ke: function () {
      return Math.floor(this.$store.getters.ke)
    }
  }
}
</script>

<style scoped lang="scss">
#status {
  position: absolute;
  top: 1em;
  right: 1em;
  border-radius: 1em;
  padding: 0.5em;
}
</style>
