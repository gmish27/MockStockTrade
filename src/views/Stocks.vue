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
            // Get total cost of buying the selected quantity of stocks
            const totalCost = stock.price * quantity;
            // Update the margin available to user for next transaction as per totalCost
            this.$store.commit('updateMargin', -totalCost);
            // Check if user is trying to buy as per available funds in account
            const canBuy = this.$store.getters.getCanBuy;

            if (canBuy) {
                this.$store.dispatch('buyStock', {
                    stock,
                    quantity
                });
                this.$buefy.toast.open({
                    message: `Bought ${quantity} stock(s) of ${stock.name}`,
                    type: 'is-success'
                })
            } else {
                this.$buefy.toast.open({
                    message: 'Sorry! Not enough funds available.',
                    type: 'is-danger'
                })
            }
        }
    }
}
</script>