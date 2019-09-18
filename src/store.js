import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    simulationInfo: {
      age: 0
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
    }

  },
  mutations: {
    updateSimulation: (state, payload) => {
      state.simulationInfo = {
        age: payload.sim.age
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
