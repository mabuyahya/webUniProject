import React from 'react';

function Login() {
  return (
    <div className="container">
      <h2>Login</h2>
      <form className="form">
        <div>
          <label>Email:</label>
          <input type="email" placeholder="Enter your email" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" placeholder="Enter your password" />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;