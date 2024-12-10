const express = require('express');
const stripe = require('stripe')('your-secret-key'); // Replace with your secret key
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Endpoint to create a checkout session
app.post('/create-checkout-session', async (req, res) => {
    const { totalAmount } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Total Purchase',
                    },
                    unit_amount: totalAmount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.BASE_URL}/success.html`,
            cancel_url: `${process.env.BASE_URL}/cancel.html`,
        });
        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating checkout session", error);
        res.status(500).send("Internal Server Error");
    }
});

// Start the server
app.listen(4242, () => {
    console.log("Server is running on port 4242");
});