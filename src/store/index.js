import Vue from 'vue'
import Vuex from 'vuex'
import { NotificationProgrammatic as Notification } from 'buefy'
import { LoadingProgrammatic as Loading } from 'buefy'
import { getFixedFloat, getRandomOffset, stockList } from "./HelperFunctions"
import portfolio from './modules/portfolio'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	state: {
		// Represents market state
		allStocks: stockList,
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
		// Initialize market data using saved market state
		initMarket: (state, marketData) => {
			state.allStocks = marketData.allStocks;
			state.marginAvailable = marketData.marginAvailable;
			state.canUserBuy = marketData.canUserBuy;
		},

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
		},

		resetTradeData: ({commit}) => {
			const market = {
				allStocks: stockList,
				marginAvailable: 100.00,
				canUserBuy: true
			};
			const portfolio = {
				holdings: [],
				realisedProfit: 0
			};
			
			commit('initMarket', market);
			commit('initPortfolio', portfolio);
			commit('logoutUser');
		},

		saveTradeData: ({getters}, vueInstance) => {
			const loader = Loading.open();
			const market = {
				allStocks: getters.getAllStocks,
				marginAvailable: getters.getMargin,
				canUserBuy: getters.canUserBuy
			};

			const portfolio = {
				holdings: getters.getHoldings,
				realisedProfit: getters.getProfit
			};

			const userId = getters.getUserUid;
			const userToken = getters.getAuthToken;

			vueInstance.$http.put(`/users/${userId}/tradeData.json?auth=${userToken}`, {market, portfolio})
				.then(() => {
					loader.close();
					Notification.open({
						message: 'Trade Data Saved.',
						type: 'is-info',
						position: 'is-bottom-right',
						hasIcon: true,
						duration: 4000
					})
				})
				.catch(err => {
					loader.close();
					const errMsg = err.response.data.error.message;
					Notification.open({
						message: `Server Error: ${errMsg}`,
						type: 'is-danger',
						position: 'is-bottom-right',
						hasIcon: true,
						duration: 4000
					})
				})
		},

		loadTradeData: ({commit, getters}, vueInstance) => {
			const loader = Loading.open();
			const userId = getters.getUserUid;
			const userToken = getters.getAuthToken;

			vueInstance.$http.get(`/users/${userId}/tradeData.json?auth=${userToken}`)
				.then(resp => {
					commit('initMarket', resp.data.market);
					commit('initPortfolio', resp.data.portfolio)
					
					Notification.open({
						message: 'Trade Data Loaded.',
						type: 'is-info',
						position: 'is-bottom-right',
						hasIcon: true,
						duration: 4000
					});
					loader.close();
				})
				.catch(err => {
					loader.close();
					const errMsg = err.response.data.error.message;
					Notification.open({
						message: `Server Error: ${errMsg}`,
						type: 'is-danger',
						position: 'is-bottom-right',
						hasIcon: true,
						duration: 4000
					})
				})
		}
	},
	modules: {
		portfolio,
		user
	}
})