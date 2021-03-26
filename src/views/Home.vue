<template>
  <div class="home">
    <p @click="SubireDmg()" >{{$store.state.Health}}</p>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
  },
  methods:{
    SubireDmg(){
      this.$store.commit("SubitDmg")
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/_variables.scss";
.home{
  background: $bleu;
}
</style>