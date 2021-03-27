import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    player:{
      name:"Bertrand",
      stats:{
        hpMax: 50,
        attack: 15,
        armor: 10,
      },
      bag:{
        gold: 10,
        weaponId:"Fusil",
        potionsQuantity:0
      }
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
