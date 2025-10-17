import { createContext, useContext } from 'react';

export const AuthContext = createContext({
  token: '',
  user: null,
  login: () => {},
  logout: () => {},
  api: null
});

export const useAuth = () => useContext(AuthContext);
