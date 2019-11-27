import { NotificationProgrammatic as Notification } from 'buefy';
import firebaseConfig from '@/fbase';

export default {
    state: {
        user: JSON.parse(window.localStorage.getItem('user'))
    },
    getters: {
        getUserStatus: state => !!state.user,
        getUserName: state => state.user.userName,
        getAuthToken: state => state.user.token,
        getRefreshToken: state => state.user.refreshToken,
        getUserUid: state => state.user.uid,
        getLoginExpiry: state => state.user.expiration
    },
    mutations: {
        updateUser: (state, payload) => {
            state.user = payload;
            // Store the user data in local storage
            window.localStorage.setItem('user', JSON.stringify(payload))
        },
        logoutUser: state => {
            window.localStorage.clear()
            state.user = null
        }
    },
    actions: {
        loginUser: ({commit, dispatch}, authData) => {
            const currentTimestamp = new Date();
            
            // Storing token expiry in msec
            const expirationTime = authData.refreshToken ? authData.expiration : (currentTimestamp.getTime() + authData.expiration);
            commit('updateUser', {
                ...authData.userData,
                expiration: expirationTime,
                refreshToken: authData.refreshToken
            });

            if (!authData.refreshToken) {
                // Auto logout with 5 mins of buffer if user did not check remember-me
                dispatch('launchTimer', authData.expiration);
            }
        },

        autoLogout: ({commit, getters, dispatch}, vueInstance) => {
            // If no user is in localStorage do nothing
            if (!getters.getUserStatus) {
                return;
            }

            // If user has checked remember-me, refresh token and exit
            if (getters.getRefreshToken) {
                // Refresh login immediately at page reload
                dispatch('refreshLogin', vueInstance);

                // Refresh login in advance of 5 mins at expiry intervals when user is on the page
                setInterval(() => {
                    dispatch('refreshLogin', vueInstance);
                }, getters.getLoginExpiry - 300*1000);                
                return;
            }

            const currentTimestamp = new Date();
            const isTimeLeft = getters.getLoginExpiry - currentTimestamp.getTime(); //returns in 'ms'
            
            // If token has already expired, logout the user
            if (isTimeLeft < 0) {
                commit('logoutUser');
                Notification.open({
                    message: 'You have been logged out!',
                    type: 'is-info',
                    position: 'is-bottom-right',
                    hasIcon: true,
                    duration: 4000
                })
                return;
            } else {
            // Delay the logout if token is yet to expire
                dispatch('launchTimer', isTimeLeft);
            }
        },

        refreshLogin: ({commit, getters}, vueInstance) => {
            const data = `grant_type=refresh_token&refresh_token=${getters.getRefreshToken}`;
            const reqOptions = {
               headers: {
                   'Content-Type': 'application/x-www-form-urlencoded',
                },
            };
            vueInstance.$http.post(`https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.API_KEY}`, data, reqOptions)
                .then(resp => {
                    commit('updateUser', {
                        userName: getters.getUserName,
                        uid: resp.data.user_id,
                        token: resp.data.id_token,
                        // Set expiration time in msec
                        expiration: resp.data.expires_in * 1000,
                        refreshToken: resp.data.refresh_token    
                    })
                })
                .catch(err => {
                    const errMsg = err.response.data.error.message;
                    Notification.open({
                        message: `Server Error ${errMsg} !`,
                        type: 'is-danger',
                        position: 'is-bottom-right',
                        hasIcon: true,
                        duration: 4000
                    });
                    commit('logoutUser');
                });
        },

        launchTimer: ({commit}, timePeriod) => {
            // Warn the user about mins left before logging out
            const warnTime = (timePeriod - 300*1000) > 0 ? 5 : Math.floor(timePeriod/60000);
            const bufferTime = warnTime*60*1000;
            setTimeout(() => {
                Notification.open({
                    message: `You will be logged out in ${warnTime} mins!`,
                    type: 'is-warning',
                    position: 'is-bottom-right',
                    hasIcon: true,
                    duration: 4000
                });
                setTimeout(() => {
                    commit('logoutUser');
                }, bufferTime);
            }, (timePeriod - bufferTime));
        }
    }
}