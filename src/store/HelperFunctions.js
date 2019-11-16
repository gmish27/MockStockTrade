export const getFixedFloat= function(number) {
	return Number.parseFloat(number.toFixed(2));
}

export const getRandomOffset= function() {
	// Get a random number between -10 and 10
	return getFixedFloat(Math.random()*(-20) + 10);
};