import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import Cookies from 'js-cookie';
function App() {
  const [books, setBooks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        <button
          onClick={async () => {
            const response = await fetch('/auth/userinfo');
            console.log('response', response);
            const data = await response.json();
            console.log('data', data);
          }}>
          Test Auth Button
        </button>

        <button onClick={createBook}>Create Book</button>

        <h2>Books</h2>

        {books.length > 0 && (
          <div className="books-container">
            {books.map((book) => (
              <div className="book" key={book.uuid}>
                <p>{book.title}</p>
                <p>{book.author}</p>
                <p>{book.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
