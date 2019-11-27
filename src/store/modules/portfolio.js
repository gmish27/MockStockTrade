import { getFixedFloat } from "../HelperFunctions";

export default {
	state: {
		holdings: [],
		realisedProfit: 0
	},
	getters: {
		// Return all portfolio holdings
		getHoldings: state => state.holdings,

		// Return the array index of a a particular holding
		getHoldingByName: (state) => (payloadStock) => {
			return state.holdings.findIndex(stock => stock.name === payloadStock.name);
		},
		
		// Get realised profit/loss
		getProfit: state => getFixedFloat(state.realisedProfit),
	},
	mutations: {
		// Initialize portfolio from saved data
		initPortfolio: (state, portfolioData) => {
			state.holdings = portfolioData.holdings || [];
			state.realisedProfit = portfolioData.realisedProfit
		},

		// Method to add a new stock in portfolio as per BUY quantity
		buyNewStock: (state, payload) => {
			state.holdings.push({
				...payload.stock,
				quantity: payload.quantity,
				// This is profit/loss per share
				profit: 0
			})
		},

		// Method to modify an existing stock in portfolio as per BUY quantity
		addToStock: (state, payload) => {
			state.holdings.splice(payload.index, 1, {
				...payload.stock
			})
		},

		// Method to completely sell stock from portfolio
		sellStock: (state, payloadIndex) => {
			state.holdings.splice(payloadIndex, 1);
		},

		// Method to partially reduce position in stock from portfolio
		removeFromStock: (state, payload) => {
			const portfolioStock = state.holdings[payload.index];
			portfolioStock.quantity =payload.quantity;
		},

		// Update profit/loss per scrip in portfolio
		updateProfit: (state, payloadFn) => {
			state.holdings.forEach(portfolioStock => {
				// Get the current market price of the same stock
				const marketStockPrice = payloadFn(portfolioStock.name);
				portfolioStock.profit = getFixedFloat(marketStockPrice - portfolioStock.price);
			});
		},

		// Update overall realsied profit/loss in the trade
		updateRealisedProfit: (state, payloadProfit) => {
			state.realisedProfit += payloadProfit
		}
	},
	actions: {
		// Payload contains stock object and quantity property
		buyStock: ({commit, state, getters, rootGetters}, payload) => {
			// Create a temp variable to hold current holdings
			const _holdings = state.holdings;
			// Check if stock bought from user already exists in portfolio
			const index = getters.getHoldingByName(payload.stock);

			if (index < 0) {
				// No index found so add as new stock in portfolio
				commit('buyNewStock', payload)
			} else {
				// Index found. Get the exact stock object
				const portfoliotStock = _holdings[index];
				// Get the current market price of the same stock
				const marketStockPrice = rootGetters.getStockMarketPrice(portfoliotStock.name);

				const totalStockQuantity = payload.quantity + portfoliotStock.quantity;
				// Calculate weighted avg. price of the stock as per quantity and market price
				const wAvgPrice = ((portfoliotStock.quantity * portfoliotStock.price) + (payload.quantity * marketStockPrice)) / totalStockQuantity;
				commit('addToStock', {
					stock: {
						name: payload.stock.name,
						price: getFixedFloat(wAvgPrice),
						quantity: totalStockQuantity,
						profit: 0
					},
					index
				})
			}
		},

		// Payload contains stock object and quantity property
		sellStock: ({commit}, payload) => {
			// Quantity of stock sold is going to be <= stock quantity in portfolio
			// as we've implemented check in input block to not exceed available qty for selling stock
			let profit;
			const portfolioStock = payload.stock;
			if (payload.quantity < portfolioStock.quantity) {
				// Update the stock quantity in portfolio
				profit = portfolioStock.profit * payload.quantity;
				commit('removeFromStock', {
					index: payload.index,
					quantity: portfolioStock.quantity - payload.quantity
				})
			} else {
				// Remove the stock from portfolio
				profit = portfolioStock.profit * portfolioStock.quantity;
				commit('sellStock', payload.index);
			}

			// Update realised profit/loss
			commit('updateRealisedProfit', profit);
		}
	}
}