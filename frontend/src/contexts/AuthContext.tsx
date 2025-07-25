"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔗 API 연결 예정: 세션 확인
  // 백엔드 세션 기반 인증 시스템과 연결
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // TODO: 실제 세션 확인 API 호출
        // const response = await fetch('/api/auth/me', {
        //   credentials: 'include',
        // });
        // 
        // if (response.ok) {
        //   const userData = await response.json();
        //   setUser(userData);
        // }
        
        // 현재는 로컬스토리지에서 사용자 정보 확인 (임시)
        const savedUser = localStorage.getItem('devmatch-user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Auth status check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    // 임시로 로컬스토리지에 저장 (실제로는 세션 쿠키 사용)
    localStorage.setItem('devmatch-user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // TODO: 실제 로그아웃 API 호출
      // await fetch('/api/auth/logout', {
      //   method: 'POST',
      //   credentials: 'include',
      // });
      
      setUser(null);
      localStorage.removeItem('devmatch-user');
    } catch (error) {
      console.error('Logout failed:', error);
      // 클라이언트에서라도 로그아웃 처리
      setUser(null);
      localStorage.removeItem('devmatch-user');
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}