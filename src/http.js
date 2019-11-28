import axios from 'axios'

export const API_KEY = process.env.VUE_APP_API_KEY;

export const authHttp = axios.create({
    baseURL: 'https://identitytoolkit.googleapis.com',
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
});

export const dataHttp = axios.create({
    baseURL: 'https://playstock-6f244.firebaseio.com/',
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
});