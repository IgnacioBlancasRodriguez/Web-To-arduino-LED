<template>
    <h1><b class="Title">{{ titleText }}</b></h1>
</template>
<script>
export default {
    name: "Title",
    props: ["titleText"]
}
</script>
<style scoped>
    .Title {
        color: #ffff;
    }
</style>