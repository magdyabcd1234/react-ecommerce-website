import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const SEED_USERS = [
  {
    id: 'usr_admin_1',
    name: 'أحمد محمود (المدير)',
    email: 'admin@store.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr_client_1',
    name: 'سارة خالد (عميل)',
    email: 'user@store.com',
    password: 'user123',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T00:00:00.000Z'
  }
];

export const AuthProvider = ({ children }) => {
  // Database of registered users in localStorage
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('app_registered_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return SEED_USERS;
      }
    }
    localStorage.setItem('app_registered_users', JSON.stringify(SEED_USERS));
    return SEED_USERS;
  });

  // Currently logged in user session
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('app_active_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authError, setAuthError] = useState('');

  // Save current active user session
  useEffect(() => {
    if (user) {
      localStorage.setItem('app_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('app_active_user');
    }
  }, [user]);

  // Sync registered users database
  useEffect(() => {
    localStorage.setItem('app_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Real Login
  const login = (email, password) => {
    setAuthError('');
    const cleanEmail = email.trim().toLowerCase();

    const foundUser = registeredUsers.find(
      u => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (foundUser) {
      const sessionUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        avatar: foundUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        loginTime: new Date().toISOString()
      };
      setUser(sessionUser);
      return { success: true, user: sessionUser };
    } else {
      const errorMsg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة. تحقق من البيانات أو أنشئ حساباً جديداً.';
      setAuthError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Real Registration
  const register = ({ name, email, password, role = 'customer' }) => {
    setAuthError('');
    const cleanEmail = email.trim().toLowerCase();

    // Check if email already registered
    const exists = registeredUsers.some(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      const errorMsg = 'هذا البريد الإلكتروني مسجل بالفعل! يرجى تسجيل الدخول أو استخدام بريد آخر.';
      setAuthError(errorMsg);
      return { success: false, message: errorMsg };
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password: password,
      role: role, // 'admin' or 'customer'
      avatar: role === 'admin' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' 
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      createdAt: new Date().toISOString()
    };

    const updatedList = [newUser, ...registeredUsers];
    setRegisteredUsers(updatedList);

    // Auto login after register
    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      loginTime: new Date().toISOString()
    };
    setUser(sessionUser);

    return { success: true, user: sessionUser };
  };

  // Real Logout
  const logout = () => {
    setUser(null);
    setAuthError('');
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'SUPER_ADMIN';
  const isCustomer = user?.role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isCustomer,
        registeredUsers,
        login,
        register,
        logout,
        authError,
        setAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
