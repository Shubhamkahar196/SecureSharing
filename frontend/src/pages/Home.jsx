import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMemo } from 'react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  // ✅ Move static data outside JSX (performance + clean code)
  const features = useMemo(() => [
    {
      title: '🔒 Password Protection',
      desc: 'Protect your files with passwords for extra security',
    },
    {
      title: '⏰ Expiration Dates',
      desc: 'Set expiration dates for automatic file removal',
    },
    {
      title: '👁️ View Limits',
      desc: 'Control how many times your files can be viewed',
    },
    {
      title: '🔗 Secure Links',
      desc: 'Generate unique, secure links for sharing',
    },
  ], []);

  return (
    <div className="home">
      {/* ================= HERO ================= */}
      <div className="hero">
        <h1>SecureSharing</h1>
        <p>
          Share your images and videos securely with password protection and expiration dates
        </p>

        <div className="hero-actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ================= FEATURES ================= */}
      <div className="features">
        <h2>Features</h2>

        <div className="features-grid">
          {features.map((item, index) => (
            <div key={index} className="feature">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;


// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Home = () => {
//   const { isAuthenticated } = useAuth();

//   return (
//     <div className="home">
//       <div className="hero">
//         <h1>SecureSharing</h1>
//         <p>Share your images and videos securely with password protection and expiration dates</p>
        
//         <div className="hero-actions">
//           {isAuthenticated ? (
//             <Link to="/dashboard" className="btn btn-primary">
//               Go to Dashboard
//             </Link>
//           ) : (
//             <>
//               <Link to="/register" className="btn btn-primary">
//                 Get Started
//               </Link>
//               <Link to="/login" className="btn btn-secondary">
//                 Login
//               </Link>
//             </>
//           )}
//         </div>
//       </div>

//       <div className="features">
//         <h2>Features</h2>
//         <div className="features-grid">
//           <div className="feature">
//             <h3>🔒 Password Protection</h3>
//             <p>Protect your files with passwords for extra security</p>
//           </div>
//           <div className="feature">
//             <h3>⏰ Expiration Dates</h3>
//             <p>Set expiration dates for automatic file removal</p>
//           </div>
//           <div className="feature">
//             <h3>👁️ View Limits</h3>
//             <p>Control how many times your files can be viewed</p>
//           </div>
//           <div className="feature">
//             <h3>🔗 Secure Links</h3>
//             <p>Generate unique, secure links for sharing</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;
