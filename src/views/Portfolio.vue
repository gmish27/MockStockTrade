<template>
    <div class="columns is-multiline">
        <app-stock
            v-for="stock in getHoldings"
            :key="stock.name"
            :stockObj="stock"
            stockActionType="Sell"
            >
        </app-stock>
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