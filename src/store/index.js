import Vue from 'vue'
import Vuex from 'vuex'
import portfolio from './portfolio'

Vue.use(Vuex)

const getRandomOffset= function() {
	// Get a random number between -10 and 10
	return (Math.random()*(-20) + 10).toFixed(2);
};

export default new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	state: {
		// Represents market state
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
		getMargin: state => (state.marginAvailable).toFixed(2),
		getCanBuy: state => state.canUserBuy,
		
		// Get current price of stock in market
		getStockMarketPrice: state => payloadStockName => {
			const marketStock = state.allStocks.find(stock => stock.name === payloadStockName);
			return marketStock.price;
		}
	},
	mutations: {
		// Update the funds available to user after a buy-order
		updateMargin: (state, payload) => {
			const newMargin = (state.marginAvailable - payload);
			if (newMargin >= 0) {
				state.marginAvailable = newMargin;
				state.canUserBuy = true;
			} else {
				state.canUserBuy = false;
			}
		},
		// Update the prices of the stock for a new trading day
		updatePrices: (state) => {
			state.allStocks.forEach(stock => {
				const newPrice = stock.price - getRandomOffset();
				stock.price = newPrice >= 0 ? newPrice.toFixed(2) : 0;
			})
		}
	},
	actions: {
		newDayAtMarket: ({commit, getters}) => {
			// Update the market prices
			commit('updatePrices');
			// Update the profit/loss for scrips in portfolio
			commit('updateProfit', getters.getStockMarketPrice);
		}
	},
	modules: {
		portfolio
	}
})