<template>
  <div class="fight">
    <div class="display">
      <div class="myself">
        <p>
          <progress
            class="nes-progress is-success"
            :max="player.hpMax"
            :value="player.hp"
          ></progress>
          {{ player.hp }} / {{ player.hpMax }} HP
        </p>
        <img
          @click="playerIsDead()"
          src="https://via.placeholder.com/100x200"
          alt=""
        />
        <div class="stats">
          <h2>{{ player.name }}</h2>
          <p>{{ player.attack }} 🗡️</p>
          <p>
            {{ player.armor }} 🛡️
            <span v-if="player.preventDamages">(se défend)</span>
          </p>
        </div>
      </div>
      <div class="enemy">
        <p>
          <progress
            class="nes-progress is-success"
            :max="mob.hpMax"
            :value="mob.hp"
          ></progress>
          {{ mob.hp }} / {{ mob.hpMax }} HP
        </p>
        <img src="https://via.placeholder.com/100x200" alt="" />
        <div class="stats">
          <h2>{{ mob.name }}</h2>

          <p>{{ mob.attack }} 🗡️</p>
          <p>{{ mob.armor }} 🛡️ <span v-if="mob.preventDamages">(se défend)</span></p>
        </div>
      </div>
    </div>
    <div v-if="!wait" class="choices">
      <button class="nes-btn" @click="attack()">Attack</button>
      <button class="nes-btn" @click="defend()">Defend</button>
      <button class="nes-btn" @click="heal()">Heal</button>
    </div>
    <div v-if="wait" class="choices">
      <button class="nes-btn is-disabled">Attack</button>
      <button class="nes-btn is-disabled">Defend</button>
      <button class="nes-btn is-disabled">Heal</button>
    </div>
    <p>{{ lastAction }}</p>
  </div>
</template>

<script>
import mobs from "@/assets/mobs.json";
import items from "@/assets/items.json";

export default {
  data() {
    return {
      lastAction: "Fight begin",
      mob: {
        // Valeur pour initalier les var parce qu'en, c'est motivié au beforeMount
        id: 0,
        name: "...",
        hpMax: 10,
        hp: 10,
        attack: 10,
        armor: 10,
        xpLoot: 100,
        preventDamages: false,
      },
      player: {
        name: this.$store.state.player.name,
        hpMax: this.$store.state.player.stats.hpMax,
        hp: 10,
        attack: this.$store.state.player.stats.attack,
        armor: this.$store.state.player.stats.armor,
        preventDamages: false,
        weapon: "",
      },
      wait: false,
    };
  },
  methods: {
    //Fonctions des boutons
    attack() {
      if (this.mob.preventDamages) {
        //Si *défend*

        this.mob.hp = this.mob.hp - (this.player.attack - this.mob.armor) / 2;
        this.mob.preventDamages = false
      } else {
        this.mob.hp = this.mob.hp - (this.player.attack - this.mob.armor);
      }
      this.lastAction =
        this.player.name +
        " attaque " +
        this.mob.name +
        " et lui inflige " +
        this.player.attack +
        "dmgs";
      this.mobTurn();
    },
    defend() {
      this.player.preventDamages = true;
      this.mobTurn();
    },
    heal() {
      this.player.hp = this.player.hp + items.Healing.Potion.Effect;
      if (this.player.hp > this.player.hpMax) {
        this.player.hp = this.player.hpMax;
      }
      this.mobTurn();
    },
    //Lance le tour du mob
    mobTurn() {
      this.preventAction(); //Bloque les boutons pour empecher de spam
      setTimeout(() => {
        //Défini un timer pour laisser durer un peu
        const luck = Math.round(Math.random() * 100);
        if (luck > 20) {
          if (this.player.preventDamages) {
            //Si *défend*
            this.player.hp =
              this.player.hp - (this.mob.attack - this.player.armor) / 2;
              this.player.preventDamages = false
          } else {
            this.player.hp =
              this.player.hp - (this.mob.attack - this.player.armor);
          }
          this.lastAction = "Le monstre attaque";
        } else {
          this.mob.preventDamages = true;
          this.lastAction = "Le monstre se prépare à se défendre";
        }
        this.wait = false;
        this.checkIfDead();
      }, 750);
    },
    preventAction() {
      this.wait = true;
    },
    //Fonction pour la mort du personnage
    checkIfDead() {
      if (this.player.hp <= 0) {
        this.player.hp = 0;
        this.$router.push({ path: "/dead" });
      } else if (this.mob.hp <= 0) {
        this.$router.push({ path: "/wp" });
      }
    },
    //Fonction pour set les stats du mob au beforeMount()
    setMobStats() {
      switch (this.$route.params.mob) {
        case "slime":
          this.id = 0;
          break;
        case "serpent":
          this.id = 1;
          break;
        case "boss":
          this.id = 2;
          break;
        default:
          alert("mdr ça existe pas gros")
          break;
      }
      this.mob.name = mobs[this.id].name;
      this.mob.hpMax = mobs[this.id].hpMax;
      this.mob.attack = mobs[this.id].attack;
      this.mob.armor = mobs[this.id].armor;
      this.mob.xpLoot = mobs[this.id].xpLoot;

      this.mob.hp = this.mob.hpMax;
    },
  },
  beforeMount() {
    this.setMobStats();
    this.player.hp = this.player.hpMax;
  },
};
</script>

<style lang="scss" scoped>
.fight {
  .display {
    display: flex;
    .enemy,
    .myself {
      width: 50%;
      display: flex;
      flex-direction: column;
      img {
        width: 100px;
        height: 200px;
      }
      progress {
        width: 50%;
      }
    }
  }
  .choices {
    display: flex;
    justify-content: space-evenly;
    button {
      width: 20%;
    }
  }
}
</style>
