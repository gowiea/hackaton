<template>
    <div>
        <p>{{$store.state.player.name}}, choisi ton arme :</p>
        <p @click="SelectWeapon('arc')">Arc à flèche</p>
        <p>Fusil</p>
        <p>Bouclier</p>
    </div>
</template>

<script>
export default {
    methods:{
        SelectWeapon(choice){
            switch (choice) {
                case "arc":
                    alert("arc choisi")
                    break;
            
                default:
                    break;
            }
        }
    }
}
</script>