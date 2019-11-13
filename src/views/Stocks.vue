<template>
    <div class="columns is-multiline">
        <app-stock
            v-for="(stock, index) in getAllStocks"
            :key="stock.name"
            :stockObj="stock"
            stockActionType="Buy"
            @trigger-stock="buyStock(stock.name, index, $event)"
            >
        </app-stock>
    </div>
</template>

<script>
import Stock from '../components/Stock';
import { mapGetters } from 'vuex'

export default {
    name: 'appStocks',
    components: {
        appStock: Stock
    },
    computed: {
        ...mapGetters([
            'getAllStocks'
        ])
    },
    methods: {
        buyStock(stockName, index, quantity) {
            this.$store.dispatch('buyStock', {
                index,
                quantity: parseInt(quantity)
            });
            this.$buefy.toast.open({
                message: `Bought ${quantity} stock(s) of ${stockName}`,
                type: 'is-success'
            })
        }
    }
}
</script>