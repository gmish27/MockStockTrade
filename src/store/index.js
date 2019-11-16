import Vue from 'vue'
import Vuex from 'vuex'
import { getFixedFloat } from "./HelperFunctions"
import { getRandomOffset } from "./HelperFunctions"
import { NotificationProgrammatic as Notification } from 'buefy'
import portfolio from './portfolio'

Vue.use(Vuex)

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

		getMargin: state => getFixedFloat(state.marginAvailable),

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
			const newMargin = (state.marginAvailable + payload);
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
				stock.price = newPrice >= 0 ? getFixedFloat(newPrice) : 0;
			})
		}
	},
	actions: {
		newDayAtMarket: ({commit, getters}) => {
			// Update the market prices
			commit('updatePrices');
			// Update the profit/loss for scrips in portfolio
			commit('updateProfit', getters.getStockMarketPrice);
			Notification.open({
				message: 'New day at the Market for trading!',
				type: 'is-info',
				position: 'is-bottom-right',
				hasIcon: true,
				duration: 4000
			})
		}
	},
	modules: {
		portfolio
	}
})