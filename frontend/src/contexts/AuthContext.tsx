"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api/auth';
import { User } from '@/types';

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

  // 🔗 API 연결 완료: 세션 확인
  // 백엔드 세션 기반 인증 시스템과 연결
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 실제 세션 확인 API 호출
        const userData = await authApi.getCurrentUser();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth status check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (userData: User) => {
    setUser(userData);
    // 세션 쿠키를 사용하므로 로컬스토리지 저장 불필요
  };

  const logout = async () => {
    try {
      // 실제 로그아웃 API 호출
      await authApi.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // 클라이언트에서라도 로그아웃 처리
      setUser(null);
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
