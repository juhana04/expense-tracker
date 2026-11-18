const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth); // every route below needs a logged-in user

// Get all my expenses (newest first)
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.userId }).sort({ date: -1, createdAt: -1 });
    res.json(expenses);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add expense
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    if (!title || !amount) return res.status(400).json({ message: 'Title and amount are required' });
    const expense = await Expense.create({ user: req.userId, title, amount, category, date: date || Date.now() });
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Edit expense
router.put('/:id', async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title, amount, category, date },
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(400).json({ message: 'Invalid id' });
  }
});

module.exports = router;
