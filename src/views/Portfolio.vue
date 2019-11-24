<template>
    <div>
        <div class="box has-text-centered" v-if="!getHoldings.length">
            <p class="title">No Stocks in your Portfolio!</p>
            <p class="subtitle">
                <router-link class="button is-success" :to="{name: 'stocks'}">Click</router-link>
                <span class="add-stock-text">to add one NOW</span>
            </p>
        </div>
        <div class="columns is-multiline" v-else>
            <app-stock
                v-for="(stock, index) in getHoldings"
                :key="stock.name"
                :stockObj="stock"
                stockActionType="Sell"
                @trigger-stock="sellStock(stock, index, $event)"
                >
            </app-stock>
        </div>
    </div>
    
</template>

<script>
import { ToastProgrammatic as Toast } from 'buefy';
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
    },
    methods: {
        sellStock(stock, index, quantity) {
            // Get total funds released by selling the selected quantity of stocks
            const totalSell = (stock.price + stock.profit) * quantity;
            // Update the margin available to user for next transaction as per totalSell
            this.$store.commit('updateMargin', totalSell);

            this.$store.dispatch('sellStock', {
                index,
                stock,
                quantity
            });
            Toast.open({
                message: `Sold ${quantity} stock(s) of ${stock.name}`,
                type: 'is-success'
            })
        }
    }
}
</script>

<style scoped>    
    .add-stock-text {
        display: inline-flex;
        margin: 5px 0 0 3px
    }

    .box {
        box-shadow: 0 .5em 1em -.125em rgba(10,10,10,.1),0 0 0 1px rgba(10,10,10,.02);
    }
</style>