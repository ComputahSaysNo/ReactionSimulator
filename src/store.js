import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    simulationInfo: {
      age: 0,
      composition: {},
      ke: 0
    },
    simPaused: false,
    drawSpeed: 1
  },
  getters: {
    age: state => {
      return state.simulationInfo.age
    },
    speed: state => {
      return state.drawSpeed
    },
    comp: state => {
      return state.simulationInfo.composition
    },
    ke: state => {
      return state.simulationInfo.ke
    }

  },
  mutations: {
    updateSimulation: (state, payload) => {
      state.simulationInfo = {
        age: payload.sim.age,
        composition: payload.sim.getComposition(),
        ke: payload.sim.getTotalKE()
      }
    },
    togglePause: state => {
      state.simPaused = !state.simPaused
    },
    setSpeed: (state, payload) => {
      state.drawSpeed = parseInt(payload)
    }
  },
  actions: {

  }
})
