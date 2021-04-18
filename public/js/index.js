import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { displayMap } from './mapbox';
import { bookTour } from './stripe'


console.log("hellow from index");

// DOM Elements
const mapBox = document.getElementById('map');
const bookbtn = document.getElementById('book-tour');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDateForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

// VALUES

// DELEGATIONS
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log(email, password)
        login(email, password);
    })
}

if (logOutBtn) {
    logOutBtn.addEventListener('click', logout)
}

if (userDateForm) {
    userDateForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        console.log(form);

        updateSettings(form, 'Data');
    })
}

if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        const btnSave = document.querySelector('.btn--save-password');
        btnSave.textContent = 'Updating...';
        const passordCurrent = document.getElementById('password-current').value;
        const passord = document.getElementById('password').value;
        const passordConfirm = document.getElementById('password-confirm').value;
        await updateSettings({ passordCurrent, passord, passordConfirm }, 'password');

        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
        btnSave.textContent = 'Save password'
    })
};

if (bookbtn) {
    bookbtn.addEventListener('click', function (e) {
        console.log('reached')
        e.target.textContent = "Processing..."
        const { tourId } = e.target.dataset;
        bookTour(tourId)
    })
}