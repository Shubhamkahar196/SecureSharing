import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

// ===============================
//  Reducer
// ===============================
const authReducer = (state, action) => {
  switch (action.type) {
    case 'START':
      return { ...state, loading: true, error: null };

    case 'SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };

    case 'FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
      };

    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// ===============================
//  Provider
// ===============================
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ===============================
  //  Initialize Auth (on load)
  // ===============================
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        return dispatch({ type: 'LOGOUT' });
      }

      try {
        const res = await authAPI.getMe();
        dispatch({ type: 'SUCCESS', payload: res.data });
      } catch {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
      }
    };

    init();
  }, []);

  // ===============================
  //  Login
  // ===============================
  const login = useCallback(async (email, password) => {
    dispatch({ type: 'START' });

    try {
      const res = await authAPI.login(email, password);
      const { token, ...user } = res.data;

      localStorage.setItem('token', token);

      dispatch({ type: 'SUCCESS', payload: user });

      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      dispatch({ type: 'FAIL', payload: msg });

      return { success: false, error: msg };
    }
  }, []);

  // ===============================
  //  Register
  // ===============================
  const register = useCallback(async (email, password) => {
    dispatch({ type: 'START' });

    try {
      const res = await authAPI.register(email, password);
      const { token, ...user } = res.data;

      localStorage.setItem('token', token);

      dispatch({ type: 'SUCCESS', payload: user });

      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      dispatch({ type: 'FAIL', payload: msg });

      return { success: false, error: msg };
    }
  }, []);

  // ===============================
  //  Logout (FIXED)
  // ===============================
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  }, []);

  // ===============================
  //  Clear Error
  // ===============================
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // ===============================
  //  Memoized Value (BIG FIX)
  // ===============================
  const value = useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      clearError,
    }),
    [state, login, register, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ===============================
//  Hook
// ===============================
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


// import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
// import { authAPI } from '../services/api';

// const AuthContext = createContext();

// const authReducer = (state, action) => {
//   switch (action.type) {
//     case 'LOGIN_START':
//       return { ...state, loading: true, error: null };
//     case 'LOGIN_SUCCESS':
//       return {
//         ...state,
//         loading: false,
//         user: action.payload,
//         isAuthenticated: true,
//         error: null
//       };
//     case 'LOGIN_FAILURE':
//       return {
//         ...state,
//         loading: false,
//         error: action.payload,
//         isAuthenticated: false,
//         user: null
//       };
//     case 'LOGOUT':
//       return {
//         ...state,
//         user: null,
//         isAuthenticated: false,
//         loading: false,
//         error: null
//       };
//     case 'CLEAR_ERROR':
//       return { ...state, error: null };
//     case 'SET_LOADING':
//       return { ...state, loading: action.payload };
//     default:
//       return state;
//   }
// };

// const initialState = {
//   user: null,
//   isAuthenticated: false,
//   loading: true, // Start with loading true
//   error: null,
// };

// export const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);

//   useEffect(() => {
//     const initializeAuth = async () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         try {
//           const response = await authAPI.getMe();
//           dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
//         } catch (error) {
//           localStorage.removeItem('token');
//           dispatch({ type: 'LOGOUT' });
//         }
//       } else {
//         dispatch({ type: 'LOGOUT' });
//       }
//     };

//     initializeAuth();
//   }, []);

//   const login = useCallback(async (email, password) => {
//     dispatch({ type: 'LOGIN_START' });
//     try {
//       const response = await authAPI.login(email, password);
//       const { token, ...user } = response.data;
//       localStorage.setItem('token', token);
//       dispatch({ type: 'LOGIN_SUCCESS', payload: user });
//       return { success: true };
//     } catch (error) {
//       const message = error.response?.data?.message || 'Login failed';
//       dispatch({ type: 'LOGIN_FAILURE', payload: message });
//       return { success: false, error: message };
//     }
//   }, []);

//   const register = useCallback(async (email, password) => {
//     dispatch({ type: 'LOGIN_START' });
//     try {
//       const response = await authAPI.register(email, password);
//       const { token, ...user } = response.data;
//       localStorage.setItem('token', token);
//       dispatch({ type: 'LOGIN_SUCCESS', payload: user });
//       return { success: true };
//     } catch (error) {
//       const message = error.response?.data?.message || 'Registration failed';
//       dispatch({ type: 'LOGIN_FAILURE', payload: message });
//       return { success: false, error: message };
//     }
//   }, []);

//   const logout = useCallback(() => {
//     localStorage.removeItem('token');
//     dispatch({ type: 'LOGOUT' });
//     // Navigate to home page after logout
//     window.location.href = '/';
//   }, []);

//   const clearError = useCallback(() => {
//     dispatch({ type: 'CLEAR_ERROR' });
//   }, []);

//   return (
//     <AuthContext.Provider value={{
//       ...state,
//       login,
//       register,
//       logout,
//       clearError,
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
