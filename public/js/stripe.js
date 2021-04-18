import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe('pk_test_51IhXcaSD18SxPipsWvEAAZvwEgYyIdiDzTuwb6lDv8bcUOhlJBtIrBsDj7sdLlAT4O3wUa9jDpRn0CE38ABIvXNi00MUghu1TF');

export const bookTour = async tourId => {
    try {
        //1. Get checkout session from the API
        const session = await axios(`/api/v1/booking/checkout-session/${tourId}`)

        //2. Create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });

    } catch (err) {
        showAlert('error', err)
    }
}