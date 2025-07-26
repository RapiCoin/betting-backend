const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

// Token check middleware
function auth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Token required' });
  try {
    const decoded = jwt.verify(token, 'secretkey');
    req.userId = decoded.id;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}

// Deposit money
router.post('/deposit', auth, async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  const user = await User.findById(req.userId);
  user.balance += amount;
  await user.save();

  await Transaction.create({ userId: user._id, type: 'deposit', amount });
  res.json({ message: 'Deposit successful', balance: user.balance });
});

// Withdraw money
router.post('/withdraw', auth, async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  const user = await User.findById(req.userId);
  if (user.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

  user.balance -= amount;
  await user.save();

  await Transaction.create({ userId: user._id, type: 'withdraw', amount });
  res.json({ message: 'Withdraw successful', balance: user.balance });
});

// Get user balance
router.get('/balance', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ balance: user.balance });
});

module.exports = router;
