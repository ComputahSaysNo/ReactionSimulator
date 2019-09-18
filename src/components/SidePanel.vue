<template>
<div class="bg-success py-2 pr-2" id="side-panel" :class="{closed: panelClosed}">
  <div id="side-panel-collapse" class="bg-success" v-on:click="panelClosed = !panelClosed"></div>
  <b-container class="bg-light w-100 h-100 rounded">
    <h1>Hi</h1>
  </b-container>
</div>
</template>

<script>
export default {
  name: 'SidePanel',
  data () {
    return {
      panelClosed: true
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

$height: 95%;
$width: 50%;

$collapse-button-height: 20%;

#side-panel {
  position: absolute;
  margin: 0;
  height: $height;
  top: 50% - $height / 2;
  width: $width;
  left: 0;
  transition: 500ms;
  border-radius: 0 1em 1em 0;
}

#side-panel.closed {
  left: -$width;
}

#side-panel-collapse {
  position: absolute;
  height: $collapse-button-height;
  top: 50% - $collapse-button-height / 2;
  width: 2em;
  left: 100%;
  border-radius: 0 1.5em 1.5em 0;
  transition: 100ms;
  &:hover {
    width: 2.5em;
  }
}
</style>
