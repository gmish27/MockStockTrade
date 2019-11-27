export const stockList = [
	{name: 'BMW', price: 50},
	{name: 'IBM', price: 20},
	{name: 'Google', price: 250},
	{name: 'Apple', price: 150},
	{name: 'Facebook', price: 170},
	{name: 'Tesla', price: 350},
]

export const getFixedFloat = function(number) {
	return Number.parseFloat(number.toFixed(2));
};

export const getRandomOffset = function() {
	// Get a random number between -10 and 10
	return getFixedFloat(Math.random()*(-20) + 10);
};