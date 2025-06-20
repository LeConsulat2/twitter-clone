// CreateAccount.tsx
import accountStyles from '../styles/account-styles.module.css';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app';
import { Link } from 'react-router-dom';


const errorMessages = {
  "auth/invalid-credential": "Invalid email or password",
  "auth/invalid-email": "Invalid email address",
  "auth/invalid-password": "Invalid password",
  "auth/email-already-in-use": "Email already in use",
}

function CreateAccount() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateFields = () => {
    const errors = {
      email: '',
      password: '',
      confirmPassword: '',
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setFieldErrors(errors);
    return Object.values(errors).every(msg => msg === '')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    

    if (!validateFields()) return;

    setIsLoading(true);
    
    // Create account
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      setSuccess('Account created successfully!');
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(errorMessages[error.code as keyof typeof errorMessages] || error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (  
    <div className={accountStyles.container}>
      <h1 className={accountStyles.title}>Create Account</h1>
      <p className={accountStyles.subtitle}>Join us today and get started</p>
      
      <form className={accountStyles.form} onSubmit={handleSubmit} autoComplete="off">

        <div className={accountStyles.inputGroup}>
          <label className={accountStyles.label} htmlFor="name">Name</label>
          <input className={accountStyles.input} type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
        </div>
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
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            required
            autoComplete="off"
          />
          {fieldErrors.password && <div className={accountStyles.error}>{fieldErrors.password}</div>}
        </div>

        <div className={accountStyles.inputGroup}>
          <label className={accountStyles.label} htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className={accountStyles.input}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleFieldChange}
            disabled={isLoading}
            required
            autoComplete="off"
          />
        </div>
        {fieldErrors.confirmPassword ? 
        <div className={accountStyles.error}>{fieldErrors.confirmPassword}
        </div> : null}

        <button
          type="submit"
          className={accountStyles.button}
          disabled={isLoading}
        >
          {isLoading && <span className={accountStyles.loadingSpinner}></span>}
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
    
        {error && <div className={accountStyles.error}>{error}</div>}
        {success && <div className={accountStyles.success}>{success}</div>}
      </form>
      <p className={accountStyles.subtitle}>Already have an account?{" "} 
        <Link to="/login">Login &rarr;</Link>
      </p>
    </div>
    
  );
}

export default CreateAccount;