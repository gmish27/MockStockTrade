// Set current user

// Check if the email used for registration already exists
export default {
    state: {
        user: JSON.parse(window.localStorage.getItem('user'))
    },
    getters: {
        getUserStatus: state => !!state.user,
        getUserName: state => state.user.userName,
    },
    mutations: {
        updateUser: (state, payload) => {
            state.user = payload
        },
        logoutUser: state => {
            window.localStorage.clear()
            state.user = null
        }
    },
    actions: {
        loginUser: ({commit}, authData) => {
            commit('updateUser', authData.userData);

            // Store the user data in local storage
            window.localStorage.setItem('user', JSON.stringify(authData.userData))
        }
    }
}