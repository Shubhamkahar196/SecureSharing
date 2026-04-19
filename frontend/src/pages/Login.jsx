import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const { login, loading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ===============================
  // 🔁 Redirect after login
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
      clearError(); // prevent repeat toasts
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

    const res = await login(formData.email, formData.password);

    if (res.success) {
      toast.success('Logged in successfully 🚀');
      const redirectTo = location.state?.from || '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [formData, login, navigate, location.state]);

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>🔐 Login to Your Account</h2>

        {/* ❌ Removed inline error UI (using toast instead) */}

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
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;


// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const { login, loading, error, isAuthenticated } = useAuth();
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
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const result = await login(formData.email, formData.password);
//     if (result.success) {
//       navigate('/dashboard');
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-form">
//         <h2>🔐 Login to Your Account</h2>
        
//         {error && <div className="error-message">{error}</div>}
        
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
//             />
//           </div>
          
//           <button type="submit" className="btn btn-primary" disabled={loading}>
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
        
//         <p className="auth-link">
//           Don't have an account? <Link to="/register">Register here</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
