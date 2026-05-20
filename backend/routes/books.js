import express from 'express';
import Book from '../models/Book.js';
import { requireAuth } from '../middleware/auth.js';
import { logSuccessfulPost } from '../middleware/logPost.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const books = await Book.find({ createdBy: req.session.userId }).sort({
      createdAt: -1,
    });

    return res.json({ books });
  } catch (error) {
    console.error('Fetch books error:', error);
    return res.status(500).json({ message: 'Failed to load books.' });
  }
});

router.post('/', requireAuth, logSuccessfulPost, async (req, res) => {
  try {
    const { title, author, year } = req.body;

    if (!title || !author || year === undefined) {
      return res
        .status(400)
        .json({ message: 'Title, author, and year are required.' });
    }

    const parsedYear = Number(year);
    if (Number.isNaN(parsedYear)) {
      return res.status(400).json({ message: 'Year must be a number.' });
    }

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      year: parsedYear,
      createdBy: req.session.userId,
    });

    return res.status(201).json({ book });
  } catch (error) {
    console.error('Create book error:', error);
    return res.status(500).json({ message: 'Failed to create book.' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { title, author, year } = req.body;

    if (!title || !author || year === undefined) {
      return res
        .status(400)
        .json({ message: 'Title, author, and year are required.' });
    }

    const parsedYear = Number(year);
    if (Number.isNaN(parsedYear)) {
      return res.status(400).json({ message: 'Year must be a number.' });
    }

    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.session.userId },
      { title: title.trim(), author: author.trim(), year: parsedYear },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    return res.json({ book });
  } catch (error) {
    console.error('Update book error:', error);
    return res.status(500).json({ message: 'Failed to update book.' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.session.userId,
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    return res.json({ message: 'Book deleted.' });
  } catch (error) {
    console.error('Delete book error:', error);
    return res.status(500).json({ message: 'Failed to delete book.' });
  }
});

export default router;
