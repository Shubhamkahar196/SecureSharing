import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { register, loading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ===============================
  // 🔁 Redirect after auth
  // ===============================
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = location.state?.from || '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // ===============================
  // 🔔 Error → Toast
  // ===============================
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError(); // avoid duplicate toasts
    }
  }, [error, clearError]);

  // ===============================
  // 🧾 Input change (stable)
  // ===============================
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // ===============================
  // 🚀 Submit (stable)
  // ===============================
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const { email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    const res = await register(email, password);

    if (res.success) {
      toast.success('Account created 🎉');
      const redirectTo = location.state?.from || '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [formData, register, navigate, location.state]);

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>🚀 Create Your Account</h2>

        {/* ❌ Removed inline error/passwordError UI (using toast) */}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;



// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Register = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [passwordError, setPasswordError] = useState('');
//   const { register, loading, error, isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate('/dashboard');
//     }
//   }, [isAuthenticated, navigate]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
    
//     if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
//       setPasswordError('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       setPasswordError('Passwords do not match');
//       return;
//     }

//     if (formData.password.length < 6) {
//       setPasswordError('Password must be at least 6 characters long');
//       return;
//     }

//     const result = await register(formData.email, formData.password);
//     if (result.success) {
//       navigate('/dashboard');
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-form">
//         <h2>🚀 Create Your Account</h2>
        
//         {error && <div className="error-message">{error}</div>}
//         {passwordError && <div className="error-message">{passwordError}</div>}
        
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               minLength={6}
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="confirmPassword">Confirm Password</label>
//             <input
//               type="password"
//               id="confirmPassword"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//             />
//           </div>
          
//           <button type="submit" className="btn btn-primary" disabled={loading}>
//             {loading ? 'Creating Account...' : 'Register'}
//           </button>
//         </form>
        
//         <p className="auth-link">
//           Already have an account? <Link to="/login">Login here</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;
