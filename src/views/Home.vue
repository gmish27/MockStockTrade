<template>
    <div class="box">
        <p class="title">Trade or View your Portfolio</p>            
        <p class="subtitle">
            You mave Save & Load your Data
            <br>
            Click on 'End Day' to begin a new Day!
        </p>            
        <hr>
        <h3>
            Your Funds: ${{ getMargin }} 
            <span id="offset-text"
                v-show="getProfit != 0"
                :class="{'has-text-success': getProfit > 0, 'has-text-danger': getProfit < 0}"
                >
                Realised P&L: ${{ Math.abs(getProfit) }}
            </span>
        </h3>
    </div>
</template>

<script>
export default {
    name: 'appHomeContent',
    computed: {
        getMargin() {
            return this.$store.getters.getMargin
        },
        getProfit() {
            return this.$store.getters.getProfit
        }
    }
}
</script>

<style scoped>
    #offset-text {
        margin-left: 1rem
    }
</style>