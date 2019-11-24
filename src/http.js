import axios from 'axios'

let VueAxiosPlugin = {}

VueAxiosPlugin.install = (Vue, options) => {
	const initOptions = {
		...options
	}
	Vue.prototype.$http = axios.create(initOptions)
}

export default VueAxiosPlugin