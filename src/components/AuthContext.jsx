import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

function getInitialUser() {
  const storedUser = localStorage.getItem('auctionAcademyUser');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('auctionAcademyUser');
    }
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);

  const signup = useCallback((username, email, password) => {
    const users = JSON.parse(localStorage.getItem('auctionAcademyUsers') || '[]');
    
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    if (users.find(u => u.username === username)) {
      return { success: false, error: 'This username is already taken.' };
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password,
      hasPaid: false,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('auctionAcademyUsers', JSON.stringify(users));

    const sessionUser = { id: newUser.id, username: newUser.username, email: newUser.email, hasPaid: newUser.hasPaid };
    setUser(sessionUser);
    localStorage.setItem('auctionAcademyUser', JSON.stringify(sessionUser));
    
    return { success: true };
  }, []);

  const login = useCallback((email, password) => {
    const users = JSON.parse(localStorage.getItem('auctionAcademyUsers') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const sessionUser = { id: foundUser.id, username: foundUser.username, email: foundUser.email, hasPaid: foundUser.hasPaid };
    setUser(sessionUser);
    localStorage.setItem('auctionAcademyUser', JSON.stringify(sessionUser));
    
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auctionAcademyUser');
  }, []);

  const markAsPaid = useCallback(() => {
    setUser(prev => {
      if (!prev) return prev;
      const updatedUser = { ...prev, hasPaid: true };
      localStorage.setItem('auctionAcademyUser', JSON.stringify(updatedUser));

      const users = JSON.parse(localStorage.getItem('auctionAcademyUsers') || '[]');
      const userIndex = users.findIndex(u => u.id === prev.id);
      if (userIndex !== -1) {
        users[userIndex].hasPaid = true;
        localStorage.setItem('auctionAcademyUsers', JSON.stringify(users));
      }
      return updatedUser;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, markAsPaid }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
