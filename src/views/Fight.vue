<template>
  <div class="fight">
    <div class="display">
      <div class="myself">
        <progress
          class="nes-progress is-success"
          :max="player.hpMax"
          :value="player.hp"
        ></progress>
        <p>{{ player.hp }} / {{ player.hpMax }} HP</p>
        <img
          @click="playerIsDead()"
          src="https://via.placeholder.com/100x200"
          alt=""
        />
        <div class="stats">
          <h2>{{ player.name }} Lv.{{ player.lvl }}</h2>
          <p>{{ player.attack }} 🗡️</p>
          <p>
            {{ player.armor }} 🛡️
            <span v-if="player.preventDamages">(se défend)</span>
          </p>
        </div>
      </div>
      <div class="enemy">
        <progress
          class="nes-progress is-success"
          :max="mob.hpMax"
          :value="mob.hp"
        ></progress>
        <p>{{ mob.hp }} / {{ mob.hpMax }} HP</p>
        <img src="https://via.placeholder.com/100x200" alt="" />
        <div class="stats">
          <h2>{{ mob.name }}</h2>

          <p>🗡️ {{ mob.attack }}</p>
          <p>
            <span v-if="mob.preventDamages">(se défend)</span> 🛡️
            {{ mob.armor }}
          </p>
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
    <div class="nes-container">
      <div class="nes-container with-title">
        <p class="title">Inventaire</p>
        <p>Arme: {{ player.weapon.name }} ({{ player.weapon.damages }})</p>
        <p>{{ player.potionsQuantity }} Potions</p>
      </div>
      <div class="history nes-container with-title">
        <p class="title">Combat</p>
        <p>{{ lastAction }}</p>
      </div>
    </div>
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
        weapon: {
          id: this.$store.state.player.bag.weaponId,
          name: "Baton",
          damages: 0,
        },
        potionsQuantity: this.$store.state.player.bag.potionsQuantity,
        lvl: this.$store.state.player.lvl,
        xp: this.$store.state.player.xp,
        xpMax: this.$store.state.player.xpMax,
      },
      wait: false,
    };
  },
  methods: {
    //Fonctions des boutons
    attack() {
      let damages =
        this.player.attack - this.mob.armor + this.player.weapon.damages;
      if (this.mob.preventDamages) {
        //Si *défend*
        this.mob.hp = this.mob.hp - damages / 2;
        this.mob.preventDamages = false;
      } else {
        this.mob.hp = this.mob.hp - damages;
      }
      this.lastAction =
        this.player.name +
        " attaque " +
        this.mob.name +
        " et lui inflige " +
        damages +
        "damages";
      this.mobTurn();
    },
    defend() {
      this.player.preventDamages = true;
      this.lastAction = "Vous vous défendez";
      this.mobTurn();
    },
    heal() {
      if (this.player.potionsQuantity > 0 && this.player.hp < this.player.hpMax) {
        this.player.hp = this.player.hp + items.Healing.Potion.Effect;
        if (this.player.hp > this.player.hpMax) {
          this.player.hp = this.player.hpMax;
        }
        this.player.potionsQuantity--
        this.mobTurn();
      } else {
        this.lastAction = "Pas de potions dans l'inventaire/HP pleins";
      }
    },
    //Lance le tour du mob
    mobTurn() {
      this.preventAction(); //Bloque les boutons pour empecher de spam
      setTimeout(() => {
        let damages = this.mob.attack - this.player.armor;
        //Défini un timer pour laisser durer un peu
        const luck = Math.round(Math.random() * 100);
        if (luck > 20) {
          if (this.player.preventDamages) {
            //Si *défend*
            this.player.hp = this.player.hp - damages / 2;
            this.player.preventDamages = false;
          } else {
            this.player.hp = this.player.hp - damages;
          }
          this.lastAction = "Le monstre attaque et infliges " + damages + "dmg";
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
        //Si le combat est perdu
        this.player.hp = 0;
        this.$router.push({ path: "/dead" });
      } else if (this.mob.hp <= 0) {
        //Si le combat est gagné
        this.mob.hp = 0;
        this.earnGold();
        this.earnXP();
        this.$router.push({ path: "/wp" });
      }
    },
    earnGold() {
      let goldAmount = mobs[this.mob.id].goldLoot + 2 * this.player.lvl +
        Math.round(Math.random() * (this.player.lvl * 1, 2));
      this.$store.commit("earnGold", goldAmount);
    },
    earnXP() {
      this.$store.commit(
        "earnExp",
        mobs[this.mob.id].xpLoot +
          this.player.lvl +
          Math.round(Math.random() * (this.player.lvl / 2))
      );
      this.checkIfLvlUp();
    },
    checkIfLvlUp() {
      if (this.player.xp >= this.player.xpMax) {
        this.$store.commit("lvlUp");
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
          alert("mdr ça existe pas gros");
          break;
      }
      this.mob.name = mobs[this.id].name;
      this.mob.hpMax = mobs[this.id].hpMax;
      this.mob.attack = mobs[this.id].attack;
      this.mob.armor = mobs[this.id].armor;
      this.mob.xpLoot = mobs[this.id].xpLoot;

      this.mob.hp = this.mob.hpMax;
    },
    setWeapon() {
      this.player.weapon.name = items.Weapons[this.player.weapon.id].name;
      this.player.weapon.damages = items.Weapons[this.player.weapon.id].dmg;
    },
  },
  beforeMount() {
    this.setMobStats();
    this.setWeapon();
    this.player.hp = this.player.hpMax;
  },
};
</script>

<style lang="scss" scoped>
.fight {
  height: 100%;
  .display {
    background-image: url("/background.svg");
    background-size: cover;
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
    .enemy {
      align-items: flex-end;
      p {
        text-align: right;
      }
      .stats {
        h2 {
          text-align: right;
        }
      }
    }
  }
  .choices {
    margin: 50px 0;
    display: flex;
    justify-content: space-evenly;
    button {
      width: 20%;
    }
  }
  .history {
    margin-top: 50px;
  }
}
</style>
