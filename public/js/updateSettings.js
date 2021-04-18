import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alerts';

// type is either password or data
export const updateSettings = async (data, type) => {
    try {
        const url = (type === 'passord') ? '/api/v1/users/updateMypassword' : '/api/v1/users/updateMe';
        const res = await axios({
            method: 'PATCH',
            url,
            data
        });

        if (res.data.status === 'success') {
            showAlert('success', `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`)
            if (type !== 'password') {
                window.setTimeout(() => {
                    location.reload('/')
                }, 1500)
            }
        }

    } catch (err) {
        showAlert('error', err.response.data.message);
    };

}