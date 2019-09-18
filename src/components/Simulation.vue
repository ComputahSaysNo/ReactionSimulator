<template>
<canvas @mousedown="beginPan($event)" @mousemove="doPan($event)" @mouseup="endPan" @wheel="handleZoom($event)"
        ref="simCanvas"></canvas>
</template>

<script>
import Simulation from '@/js/simulation'
import Graphics from '@/js/graphics'

export default {
  name: 'Simulation',

  data () {
    return {}
  },

  /* Graphics and simulation are stored outside of data() to prevent Vue from making them reactive.
  If they were in data, then the big particle list contained within simulation (and graphics) would be updated by Vue
  every tick and lag the program out.
   */
  simulation: new Simulation(),
  graphics: null,

  computed: { // These are so graphics and simulation can still be accessed via the usual this.graphics or this.simulation
    simulation: function () {
      return this.$options.simulation
    },
    graphics: function () {
      return this.$options.graphics
    }
  },
  mounted: function () {
    this.initCanvas()
    this.animateParticles()
    setInterval(this.updateStore, 100)
  },
  methods: {
    initCanvas: function () {
      // Initialises the canvas into the graphics object and resizes it
      let canvas = this.$refs.simCanvas
      this.$options.graphics = new Graphics(canvas, this.simulation)
      this.resizeCanvas()
      window.addEventListener('resize', this.resizeCanvas)
    },
    resizeCanvas: function () {
      // Makes the canvas the width of its parent (main), whose size is determined by css flexbox
      // Also updates the zoom and centering of the simulation when this is done
      let parent = document.getElementById('main')
      let ctx = this.$refs.simCanvas.getContext('2d')
      ctx.canvas.width = parent.offsetWidth
      ctx.canvas.height = parent.offsetHeight
      this.graphics.setBaseZoom()
      this.graphics.centerSim()
    },
    animateParticles: function () {
      this.graphics.drawFrame()
      if (!this.$store.state.simPaused) {
        for (let i = 0; i < this.$store.state.drawSpeed; i++) {
          this.simulation.tick()
        }
      }
      window.requestAnimationFrame(this.animateParticles)
    },
    updateStore: function () {
      // Transfers important data back to the Vuex store so they can be accessed by the rest of the site
      // It's OK for this to be reactive, as it is only updated once a second
      this.$store.commit('updateSimulation', { sim: this.simulation })
    },

    // A set of functions for passing mouse input back to the graphics object
    handleZoom: function ($event) {
      this.graphics.handleZoom($event)
    },
    beginPan: function ($event) {
      this.graphics.startPan($event)
    },
    endPan: function () {
      this.graphics.endPan()
    },
    doPan: function ($event) {
      this.graphics.doPan($event)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
