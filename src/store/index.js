import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const portfolio = {
	state: {
		holdings: []
	},
	getters: {
		getHoldings: state => state.holdings
	},
	mutations: {
		buyStock(state, payload) {
			state.holdings.push({
				...payload.stock,
				count: payload.quantity
			})
		}
	},
	actions: {
		
	}
}

export default new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	state: {
		allStocks: [
			{name: 'BMW', price: 50},
			{name: 'IBM', price: 20},
			{name: 'Google', price: 250},
			{name: 'Apple', price: 150},
			{name: 'Facebook', price: 170},
			{name: 'Tesla', price: 350},
		]
	},
	getters: {
		getAllStocks: state => state.allStocks
	},
	mutations: {
	},
	actions: {
	},
	modules: {
		portfolio
	}
})
