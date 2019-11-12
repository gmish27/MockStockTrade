<template>
    <div class="columns is-multiline">
        <app-stock
            v-for="stock in getAllStocks"
            :key="stock.name"
            :stockObj="stock"
            stockActionType="Buy"
            @trigger-stock="buyStock(stock, $event)"
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
        buyStock(stock, quantity) {
            this.$store.dispatch('buyStock', {
                stock,
                quantity: parseInt(quantity)
            });
            this.$buefy.toast.open({
                message: `Bought ${quantity} stocks of ${stock.name}`,
                type: 'is-success'
            })
        }
    }
}
</script>