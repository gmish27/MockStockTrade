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
		marginAvailable: 100.00,
		canUserBuy: true
	},
	getters: {
		getAllStocks: state => state.allStocks,
		getMargin: state => state.marginAvailable,
		getCanBuy: state => state.canUserBuy,
		
		// Find a particular stock from all available stocks
		getStockByName: state => payloadStock => {
			return state.allStocks.findIndex(stock => stock.name === payloadStock.name);
		}
	},
	mutations: {
		updateMargin: (state, payload) => {
			const newMargin = state.marginAvailable - payload;
			if (newMargin >= 0) {
				state.marginAvailable = newMargin;
				state.canUserBuy = true;
			} else {
				state.canUserBuy = false;
			}
		}
	},
	actions: {
	},
	modules: {
		portfolio
	}
})