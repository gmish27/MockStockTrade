<template>
    <div>
        <div class="box has-text-centered" v-if="getHoldings.length === 0">
            <p class="title">No Stocks in your Portfolio!</p>
            <p class="subtitle">
                <router-link class="button is-success" :to="{name: 'stocks'}">Click</router-link>
                <span class="add-stock-text">to add one NOW</span>
            </p>
        </div>
        <div class="columns is-multiline" v-else>
            <app-stock
                v-for="stock in getHoldings"
                :key="stock.name"
                :stockObj="stock"
                stockActionType="Sell"
                >
            </app-stock>
        </div>
    </div>
    
</template>

<script>
import Stock from '../components/Stock';

export default {
    name: 'appPortfolio',
    components: {
        appStock: Stock
    },
    computed: {
        getHoldings() {
            return this.$store.getters.getHoldings
        }
    }
}
</script>

<style scoped>    
    .add-stock-text {
        display: inline-flex;
        margin: 5px 0 0 3px
    }
</style>