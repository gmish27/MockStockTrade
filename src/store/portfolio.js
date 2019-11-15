export default {
	state: {
		holdings: [],
		profit: 0
	},
	getters: {
		// Return all portfolio holdings
		getHoldings: state => state.holdings,
		// Return the array index of a a particular holding
		getHoldingByName: (state) => (payloadStock) => {
			return state.holdings.findIndex(stock => stock.name === payloadStock.name);
		},
		// Get realised profit/loss
		getProfit: state => (state.profit).toFixed(2),
	},
	mutations: {
		// Method to add a new stock in portfolio as per BUY quantity
		buyNewStock: (state, payload) => {
			state.holdings.push({
				...payload.stock,
				quantity: payload.quantity,
				profit: null
			})
		},
		// Method to modify an existing stock in portfolio as per BUY quantity
		addToStock: (state, payload) => {
			state.holdings.splice(payload.index, 1, {
				...payload.stock
			})
		},
		// Update profit/loss for scrips in portfolio
		updateProfit: (state, payloadFn) => {
			state.holdings.forEach(portfolioStock => {
				// Get the current market price of the same stock
				const marketStockPrice = payloadFn(portfolioStock.name);
				if (marketStockPrice > portfolioStock.price) {
					// This means the scrip is trading at profit
					portfolioStock.profit = true;
				} else {
					portfolioStock.profit = false;
				}
			});
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
						price: wAvgPrice.toFixed(2),
						quantity: totalStockQuantity,
						profit: null
					},
					index
				})
			}
		},
	}
}