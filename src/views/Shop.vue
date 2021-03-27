<template>
  <div class="shop">
    <h1>THE SHOP</h1>

    <h2>Welcome, {{ $store.state.player.name }}</h2>

    <p>You've got {{ golds }} 🪙</p>
    <br />

    <div class="stock">
      <div class="weapon">
        <p>Sword - {{weaponPrice}}</p>
        <img src="https://via.placeholder.com/150x100" alt="">
        <button class="nes-btn" @click="buy(1)">Buy</button>
      </div>
      <div class="stat">
        <p>Stats</p>
        <img src="https://via.placeholder.com/150x100" alt="">
        <button class="nes-btn" @click="buy(2)">Buy</button>
      </div>
      <div class="potion">
        <p> {{nbrPotions}} Potions</p>
        <img src="https://via.placeholder.com/150x100" alt="">
        <button class="nes-btn" @click="buy(3)">Buy</button>
      </div>
    </div>
    <div class="back">
        <router-link to="/">
        <button class="nes-btn">Back to the game</button>
        </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.shop {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  h1 {
    border: 8px solid black;
    margin: 20px;
  }
  .stock {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    div{
      display: flex;
      flex-direction: column;
      align-items: center;
      p{
        margin:0;
      }
      img{
        margin:20px 0;
      }
    }
  }
  .back {
    margin-top: 50px;
  }
}
</style>

<script>
export default {
  data() {
    return {
        golds: this.$store.state.player.bag.gold,
        nbrPotions:0,
        weaponPrice:0,
    };
  },
  methods:{
    genPotionsNmbr(min, max){
      min = Math.ceil(min);
      max = Math.floor(max);
      this.nbrPotions = Math.floor(Math.random() * (max - min +1)) + min;
    },
    buy(params){
      switch (params) {
        case 1:
          this.$store.commit('spendGold', 50*this.$store.state.player.weaponLvl)
          this.lvlUpWeapon()
          break;
        case 2:
          this.$store.commit('spendGold', 50*this.$store.state.player.weaponLvl)
          this.lvlUpWeapon()
          break;
        case 3:
          this.$store.commit('spendGold', 50*this.$store.state.player.weaponLvl)
          this.lvlUpWeapon()
          break;
        default:
          break;
      }
    },
    lvlUpWeapon(){
      this.$store.commit('upgradeWeapon')
    }
  },
  beforeMount(){
    this.genPotionsNmbr(1,5)
  }

};
</script>