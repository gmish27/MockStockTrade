export default {
	state: {
		holdings: []
	},
	getters: {
		// Return all portfolio holdings
		getHoldings: state => state.holdings,
		// Return the array index of a a particular holding
		getHoldingByName: (state) => (payloadStock) => {
			return state.holdings.findIndex(stock => stock.name === payloadStock.name);
		}
	},
	mutations: {
		// Method to add a new stock in portfolio as per BUY quantity
		buyNewStock: (state, payload) => {
			state.holdings.push({
				...payload.stock,
				quantity: payload.quantity
			})
		},
		// Method to modify an existing stock in portfolio as per BUY quantity
		addToStock: (state, payload) => {
			state.holdings.splice(payload.index, 1, {
				...payload.stock
			})
		}
	},
	actions: {
		// Payload contains stock object and quantity property
		buyStock: ({commit, state, getters}, payload) => {
			// Create a temp variable to hold current holdings
			const _holdings = state.holdings;
			// Check if stock bought from user already exists in portfolio
			const index = getters.getHoldingByName(payload.stock);

			if (index < 0) {
				// No index found so add as new stock in portfolio
				commit('buyNewStock', payload)
			} else {
				// Index found. Update stock with new quantity
				const currentStockPosition = _holdings[index];
				commit('addToStock', {
					stock: {
						...payload.stock,
						quantity: currentStockPosition.quantity + payload.quantity,
					},
					index
				})
			}
		}
	}
}