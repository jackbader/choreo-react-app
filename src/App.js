import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import Cookies from 'js-cookie';
function App() {
  const [books, setBooks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('');

  const apiUrl = window?.configs?.apiUrl ? window.configs.apiUrl : 'http://localhost:8080';

  console.log('apiUrl', apiUrl);

  const getBooks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/reading-list/books`);
      console.log('response.data', response.data);
      const booksArray = [];
      for (const key in response.data) {
        booksArray.push(response.data[key]);
      }
      setBooks(booksArray);
    } catch (e) {
      console.log('error', e);
    }
  };

  const createBook = async () => {
    try {
      const response = await axios.post(`${apiUrl}/reading-list/books`, {
        title: 'Book Title',
        author: 'Book Author',
        status: 'to_read'
      });
      console.log('response', response);

      // add the new book to the list
      setBooks([...books, response.data]);
    } catch (e) {
      console.log('error', e);
    }
  };

  const deleteBook = async (id) => {
    console.log('delete book id', id);
    // try {
    //   const response = await axios.delete(`${apiUrl}/reading-list/books/${id}`);
    //   console.log('response', response);
    //   // remove the book from the list
    //   setBooks(books.filter((book) => book.id !== id));
    // } catch (e) {
    //   console.log('error', e);
    // }
  };

  const getUser = async () => {
    // Read userinfo cookie value.
    try {
      const response = await axios.get('/auth/userinfo');
      console.log('response', response);
      setIsLoggedIn(true);
    } catch (e) {
      console.log('error', e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createBook({ title, author, status });
  };

  useEffect(() => {
    getUser();
    getBooks();
  }, []);

  return (
    <div>
      <header className="header">
        <h1>Choreo Submission</h1>
        <div>
          {isLoggedIn ? (
            <button
              onClick={async () => {
                window.location.href = `/auth/logout?session_hint=${Cookies.get('session_hint')}`;
              }}>
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                window.location.href = '/auth/login';
              }}>
              Login
            </button>
          )}
        </div>
      </header>

      <div className="main">
        <form className="book-form" onSubmit={handleSubmit}>
          <label>
            Title:
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Author:
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </label>
          <label>
            Status:
            <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
          </label>
          <button type="submit">Create Book</button>
        </form>

        <h2>Books</h2>

        {books.length > 0 && (
          <div className="books-container">
            {books.map((book) => (
              <div className="book" key={book.id}>
                <p>Title: {book.title}</p>
                <p>Author: {book.author}</p>
                <p>Status: {book.status}</p>
                <button onClick={() => deleteBook(book.id)}></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
