<template>
    <div class="MainDiv">
        <Title :titleText="'The remote LED project'"/>
        <br>
        <LEDComponent v-bind:ledState="Off"/>
        <br>
        <TurnOnOffBtn :LedComponent="LEDComponent"/>
    </div>
</template>
<script>
import TurnOnOffBtn from "./TurnOnOffBtn.vue"
import LEDComponent from "./LEDComponent.vue"
import Title from "./Title.vue"

export default {
    name: 'MainComponent',
    components: {
        TurnOnOffBtn,
        LEDComponent,
        Title
    }
}
</script>
<style scoped>
.MainDiv {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: stretch;
    align-items: center;
    width: 100%;
}
</style>