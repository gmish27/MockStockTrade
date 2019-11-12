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
