import { NotificationProgrammatic as Notification } from 'buefy';
import firebaseConfig from '@/fbase';
import {authHttp, dataHttp, API_KEY} from '@/http';

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
        registerUser: (context, userData) => {
            return new Promise((resolve, reject) => {
                authHttp.post(`/v1/accounts:signUp?key=${API_KEY}`, {
                    email: userData.email,
                    password: userData.password,
                    returnSecureToken: true
                })
                    .then(resp => {
                        // Get UID of user to create primary key in db
                        const uid = resp.data.localId;
                        // Get JWT of user
                        const tokenId = resp.data.idToken;
    
                        // Create an entry for the user in db
                        dataHttp.put(`/users/${uid}.json?auth=${tokenId}`, {"name": userData.name})
                            .then(() => resolve())
                            .catch(err => {
                                window.console.log(err.response)
                                reject(err.response)
                            });
                    })
                    .catch(err => reject(err.response));
            })
        },

        loginUser: ({commit, dispatch}, authData) => {
            return new Promise((resolve, reject) => {
                authHttp.post(`/v1/accounts:signInWithPassword?key=${API_KEY}`, {
                    email: authData.email,
                    password: authData.password,
                    returnSecureToken: true
                })
                    .then(async (resp) => {
                        const uid = resp.data.localId;
                        const token = resp.data.idToken;
                        // Get user name
                        const userName = await dataHttp.get(`/users/${uid}/name.json?auth=${token}`)
                            .then(resp => {
                                resolve();
                                return resp.data;
                            })
                            .catch(err => reject(err.response)); 
                        
                        // Set expiration time in msec
                        const expiration = resp.data.expiresIn * 1000;
                        // Save user refresh token iff user wants to be remembered
                        const refreshToken = authData.remember ? resp.data.refreshToken : null;

                        const currentTimestamp = new Date();            
                        // Storing token expiry in msec
                        const expirationTime = refreshToken ? expiration : (currentTimestamp.getTime() + expiration);
                        commit('updateUser', {
                            userName,
                            uid,
                            token,
                            expiration: expirationTime,
                            refreshToken
                        });

                        if (!refreshToken) {
                            // Auto logout with 5 mins of buffer if user did not check remember-me
                            dispatch('launchTimer', expiration);
                        }

                    })
                    .catch(err => reject(err.response));
            })
        },

        autoLogout: ({getters, dispatch, rootDispatch}, vueInstance) => {
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
                rootDispatch('resetTradeData');
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

        refreshLogin: ({commit, getters, rootDispatch}, vueInstance) => {
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
                    rootDispatch('resetTradeData');
                });
        },

        launchTimer: ({rootDispatch}, timePeriod) => {
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
                    rootDispatch('resetTradeData');
                }, bufferTime);
            }, (timePeriod - bufferTime));
        }
    }
}