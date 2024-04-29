import logo from './logo.svg';
import './App.css';
import Cookies from 'js-cookie';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <button
          onClick={() => {
            window.location.href = '/auth/login';
          }}>
          Login
        </button>
        <button
          onClick={async () => {
            window.location.href = `/auth/logout?session_hint=${Cookies.get('session_hint')}`;
          }}>
          Logout
        </button>
        <button
          onClick={async () => {
            const response = await fetch('/auth/userinfo');
            console.log('response', response);
            const data = await response.json();
            console.log('data', data);
          }}>
          Test Auth
        </button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
