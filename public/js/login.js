import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email: email,
                password: password
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!')
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }

    } catch (err) {
        showAlert('error', err.response.data.message);
    };
};

export const logout = async () => {
    console.log()
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });
        if (res.data.status = 'success') {
            showAlert('success', 'Logged out successfully!')
            window.setTimeout(() => {
                if (window.location.pathname === '/me' || window.location.pathname === '/my-tour')
                    location.assign('/')
                else
                    location.reload('/')
            }, 1500)
        }
    } catch (err) {
        console.log(err)
        showAlert('error', 'Error logging out! Try Again.')
    }
}