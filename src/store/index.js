import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    player: {
      name: "Bertrand",
      xp: 0,
      xpMax: 6,
      lvl: 1,
      weaponLvl: 1,
      stats: {
        hpMax: 50,
        attack: 5,
        armor: 10,
      },
      bag: {
        gold: 10,
        weaponId: 0,
        potionsQuantity: 1,
      },
    },
  },
  mutations: {
    earnGold(state, amount) {
      state.player.bag.gold = state.player.bag.gold + amount;
    },
    spendGold(state, amount) {
      state.player.bag.gold = state.player.bag.gold - amount;
    },
    earnExp(state, amount) {
      state.player.xp = state.player.xp + amount;
    },
    upgradeWeapon(state) {
      state.player.weaponLvl++;
    },
    lvlUp(state) {
      state.player.xp = state.player.xp - state.player.xpMax;
      state.player.lvl++;
      state.player.xpMax = state.player.xpMax + 2;
      state.player.stats.armor = state.player.stats.armor + 3;
      state.player.stats.hpMax = state.player.stats.hpMax +6 ;
      state.player.stats.attack = state.player.stats.attack + 3;
    }
  },
  actions: {},
  modules: {},
});
