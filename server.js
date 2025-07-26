const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallet');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/betapp');

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
