<template>
<div class="bg-dark" id="controls">
  <b-container fluid>
    <b-row no-gutters>
      <b-col class="my-auto mr-3" cols="auto" style="text-align: center">
        <b-button-group>
          <b-button :variant="buttonVariant" @click="togglePause"><font-awesome-icon :icon="buttonIcon"/></b-button>
          <b-button variant="danger"><font-awesome-icon icon="stop" /></b-button>
        </b-button-group>
      </b-col>
      <b-col class="my-auto" id="speed-slider">
        <b-form-input v-model="speed" class="w-100" max="100" min="1" type="range"></b-form-input>
        <b-badge pill variant="info" class="w-100">Speed: {{ speed }}x</b-badge>
      </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
export default {
  name: 'Controls',
  methods: {
    togglePause: function () {
      this.$store.commit('togglePause')
      this.buttonText = this.$store.state.simPaused ? 'Play' : 'Pause'
    }
  },
  computed: {
    speed: {
      get: function () {
        return this.$store.state.drawSpeed
      },
      set: function (newSpeed) {
        this.$store.commit('setSpeed', newSpeed)
      }
    },
    buttonIcon: function () {
      return this.$store.state.simPaused ? 'play' : 'pause'
    },
    buttonVariant: function () {
      return this.$store.state.simPaused ? 'success' : 'primary'
    }
  }
}
</script>

<style lang="scss" scoped>
#controls {
  position: absolute;
  bottom: 1em;
  right: 1em;
  border-radius: 1em;
  padding: 0.5em;
}

#speed-slider {
  width: 7em;
}
</style>
