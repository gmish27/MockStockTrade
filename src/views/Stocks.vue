<template>
    <div class="columns is-multiline">
        <app-stock
            v-for="stock in getAllStocks"
            :key="stock.name"
            :stockObj="stock"
            @trigger-stock="buyStock(stock, $event)"
            >
            Buy
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
            this.$store.commit('buyStock', {
                stock,
                quantity
            })
        }
    }
}
</script>