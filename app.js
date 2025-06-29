const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Text = require('./models/Text');
app.use(express.static('public'));


const app = express();

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/textDb')
    .then(() => console.log('MONGO CONNECTION OPEN!'))
    .catch(err => console.log('MONGO CONNECTION ERROR!', err));

// Config
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index', { result: null });
});

app.post('/analyze', async (req, res) => {
    const userInput = req.body.text;
    const saved = await Text.create({ text: userInput });

    try {
        const response = await fetch('http://localhost:5000/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: userInput })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch model API');
        }

        const data = await response.json();
        const { prediction, confidence, explanation } = data;


        res.render('index', {
            result: { prediction, confidence, explanation }
        });

    } catch (error) {
        console.error("Error calling model API:", error);
        res.render('index', { result: { prediction: 'Error', confidence: 'N/A', explanation: 'Model server not responding.' } });
    }
});

app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!");
});
