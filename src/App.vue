<template>
<div id="app">
  <div id="header">
    <TopBar></TopBar>
  </div>
  <div id="main">
    <Simulation></Simulation>
    <SidePanel></SidePanel>
    <Status></Status>
    <Controls></Controls>
  </div>
</div>
</template>

<script>
import TopBar from '@/components/TopBar'
import Simulation from '@/components/Simulation'
import SidePanel from '@/components/SidePanel'
import Controls from '@/components/Controls'
import Status from '@/components/Status'

export default {
  name: 'app',
  components: {
    TopBar,
    Simulation,
    SidePanel,
    Controls,
    Status
  }
}
</script>

<style lang="scss">

#app {
  display: flex;
  height: 100%;
  flex-flow: column;

  #header {
    flex: 0 1 auto;
  }

  #main {
    flex: 1 1 auto;
    height: 100%;
    position: relative;
    background: #d2d2d2
  }
}

html, body {
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

</style>
