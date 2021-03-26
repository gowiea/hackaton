import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Health : 10
  },
  mutations: {
    SubitDmg(state){
      state.Health--
    }
  },
  actions: {
  },
  modules: {
  }
})
