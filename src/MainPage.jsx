import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from './api';

function MainPage({ user, loadingUser, sessionError }) {
  const [books, setBooks] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [sortByYear, setSortByYear] = useState('none');
  const [form, setForm] = useState({ title: '', author: '', year: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loadingBooks, setLoadingBooks] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadBooks = async () => {
      setLoadingBooks(true);
      setError('');
      try {
        const data = await apiRequest('/api/books');
        setBooks(data.books);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingBooks(false);
      }
    };

    loadBooks();
  }, [user]);

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) =>
        book.title.toLowerCase().includes(searchTitle.toLowerCase())
      )
      .sort((a, b) => {
        if (sortByYear === 'asc') return a.year - b.year;
        if (sortByYear === 'desc') return b.year - a.year;
        return 0;
      });
  }, [books, searchTitle, sortByYear]);

  const updateForm = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const resetForm = () => {
    setForm({ title: '', author: '', year: '' });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const payload = {
      title: form.title,
      author: form.author,
      year: Number(form.year),
    };

    try {
      if (editingId) {
        const data = await apiRequest(`/api/books/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });

        setBooks((prev) =>
          prev.map((book) => (book._id === editingId ? data.book : book))
        );
      } else {
        const data = await apiRequest('/api/books', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        setBooks((prev) => [data.book, ...prev]);
      }

      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (book) => {
    setEditingId(book._id);
    setForm({ title: book.title, author: book.author, year: book.year });
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await apiRequest(`/api/books/${id}`, { method: 'DELETE' });
      setBooks((prev) => prev.filter((book) => book._id !== id));
      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Books</h2>

      {loadingUser && <p className="status-text">Loading your session...</p>}
      {sessionError && <p className="status-text error-text">{sessionError}</p>}
      {!loadingUser && !user && (
        <p className="status-text">Please log in to manage your books.</p>
      )}
      {error && <p className="status-text error-text">{error}</p>}

      {user && (
        <>
          <form className="form" onSubmit={handleSubmit}>
            <div>
              <label>Title:</label>
              <input
                type="text"
                value={form.title}
                onChange={updateForm('title')}
                placeholder="Enter title..."
                required
              />
            </div>
            <div>
              <label>Author:</label>
              <input
                type="text"
                value={form.author}
                onChange={updateForm('author')}
                placeholder="Enter author..."
                required
              />
            </div>
            <div>
              <label>Year:</label>
              <input
                type="number"
                value={form.year}
                onChange={updateForm('year')}
                placeholder="Enter year..."
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit">{editingId ? 'Update' : 'Add Book'}</button>
              {editingId && (
                <button type="button" className="secondary" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="controls">
            <div>
              <label>Search by title:</label>
              <input
                type="text"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                placeholder="Enter title..."
              />
            </div>

            <div>
              <label>Sort by year:</label>
              <select
                value={sortByYear}
                onChange={(e) => setSortByYear(e.target.value)}
              >
                <option value="none">None</option>
                <option value="asc">Oldest First</option>
                <option value="desc">Newest First</option>
              </select>
            </div>
          </div>

          {loadingBooks ? (
            <p className="status-text">Loading books...</p>
          ) : (
            <table className="books-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.year}</td>
                    <td>
                      <div className="table-actions">
                        <button type="button" onClick={() => startEdit(book)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="secondary"
                          onClick={() => handleDelete(book._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default MainPage;
