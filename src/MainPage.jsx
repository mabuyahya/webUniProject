import React, { useState } from 'react';

function MainPage() {
  const [books] = useState([
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
    { id: 2, title: '1984', author: 'George Orwell', year: 1949 },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
    { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813 },
    { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', year: 1951 },
    { id: 6, title: 'Brave New World', author: 'Aldous Huxley', year: 1932 },
    { id: 7, title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937 },
    { id: 8, title: 'Wuthering Heights', author: 'Emily Brontë', year: 1847 },
    { id: 9, title: 'Jane Eyre', author: 'Charlotte Brontë', year: 1847 },
    { id: 10, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', year: 1954 },
  ]);

  const [searchTitle, setSearchTitle] = useState('');
  const [sortByYear, setSortByYear] = useState('none');

  const filteredBooks = books
    .filter(book => book.title.toLowerCase().includes(searchTitle.toLowerCase()))
    .sort((a, b) => {
      if (sortByYear === 'asc') return a.year - b.year;
      if (sortByYear === 'desc') return b.year - a.year;
      return 0;
    });

  return (
    <div className="container">
      <h2>Books</h2>

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
          <select value={sortByYear} onChange={(e) => setSortByYear(e.target.value)}>
            <option value="none">None</option>
            <option value="asc">Oldest First</option>
            <option value="desc">Newest First</option>
          </select>
        </div>
      </div>

      <table className="books-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map(book => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MainPage;