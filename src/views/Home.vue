<template>
    <div class="box">
        <p class="title">Trade or View your Portfolio</p>            
        <p class="subtitle">
            You mave Save & Load your Data
            <br>
            Click on 'End Day' to begin a new Day!
        </p>            
        <hr>
        <h3>Your Funds: ${{ getMargin }} </h3>
    </div>
</template>

<script>
export default {
    name: 'appHomeContent',
    computed: {
        getMargin() {
            return this.$store.getters.getMargin
        }
    }
}
</script>