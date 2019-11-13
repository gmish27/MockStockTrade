import Vue from 'vue'
import Vuex from 'vuex'
import portfolio from './portfolio'

Vue.use(Vuex)

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
		],
		marginAvailable: 100
	},
	getters: {
		getAllStocks: state => state.allStocks,
		getMargin: state => state.marginAvailable,
		
		// Find a particular stock from all available stocks
		getStockByName: state => payloadStock => {
			return state.allStocks.findIndex(stock => stock.name === payloadStock.name);
		}
	},
	mutations: {
	},
	actions: {
	},
	modules: {
		portfolio
	}
})