<template>
    <div>
        <img src="../assets/LEDoff.png" v-show="getState === 'Off'">
        <img src="../assets/LEDon.png" v-show="getState === 'On'">
    </div>
</template>
<script>
export default {
    name: "LEDComponent",
    computed: {
        getState () {
            console.log(`Changed state: ${ this.$store.state.ledState }`);

            return this.$store.state.ledState
        },
    }
}
</script>