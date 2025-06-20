// Login.tsx
import accountStyles from '../styles/account-styles.module.css';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app';
import { Link, useNavigate } from 'react-router-dom';


const errorMessages = {
  "auth/user-not-found": "User not found",
  "auth/wrong-password": "Wrong password",
  "auth/invalid-credential": "Invalid email or password",
}

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    // Login
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      setSuccess('Logged in successfully!');
      setTimeout(() => navigate("/"), 2000)
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(errorMessages[error.code as keyof typeof errorMessages] || error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={accountStyles.container}>
      <h1 className={accountStyles.title}>Login</h1>
      <p className={accountStyles.subtitle}>Login to your account</p>
      
      <form className={accountStyles.form} onSubmit={handleSubmit} autoComplete="off">
        <div className={accountStyles.inputGroup}>
          <label className={accountStyles.label} htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={accountStyles.input}
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            required
            autoComplete="off"
          />
        </div>

        <div className={accountStyles.inputGroup}>
          <label className={accountStyles.label} htmlFor="password">
            Password
          </label>  
          <input
            id="password"
            name="password"
            type="password"
            className={accountStyles.input}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            required
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className={accountStyles.button}
          disabled={isLoading}
        >
          {isLoading && <span className={accountStyles.loadingSpinner}></span>}
          {isLoading ? 'Logging In...' : 'Login'}
        </button>

        {error && <div className={accountStyles.error}>{error}</div>}
        {success && <div className={accountStyles.success}>{success}</div>}
      </form>
      <p className={accountStyles.subtitle}>Don't have an account?  
        <Link to="/create-account">  Create one &rarr;</Link>
      </p>
    </div>
  );
}

export default Login;