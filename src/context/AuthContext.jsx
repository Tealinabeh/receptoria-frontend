import { createContext, useReducer, useEffect, useContext } from 'react';
import { useApolloClient } from "@apollo/client";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'LOAD_USER_FROM_STORAGE':
      return {
        ...state,
        isAuthenticated: !!action.payload.token,
        user: action.payload.user,
        token: action.payload.token,
      };
    default:
      return state;
  }
};

const AuthContext = createContext({
  state: initialState,
  dispatch: () => null,
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userDataString = localStorage.getItem('userData');

    if (token && userDataString) {
      try {
        const user = JSON.parse(userDataString);
        dispatch({ type: 'LOAD_USER_FROM_STORAGE', payload: { user, token } });
      } catch (error) {
        console.error("Не вдалося розпарсити дані користувача з localStorage:", error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
  }, []);
  const login = (userData, authToken) => {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user: userData, token: authToken } });
  };

  const client = useApolloClient();
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    client.resetStore();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth необходимо використовувати всередині AuthProvider');
  }
  return context;
};