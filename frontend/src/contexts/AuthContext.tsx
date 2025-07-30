// ============================================
// 🔐 인증 컨텍스트 (로그인 상태 관리)
// ============================================

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser } from '@/lib/api/user';
import { logout } from '@/lib/api/auth';
import { User } from '@/types';


// ============================================
// 📊 컨텍스트 타입 정의
// ============================================

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

// ============================================
// 🎯 컨텍스트 생성
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// 🏗️ AuthProvider 컴포넌트
// ============================================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ============================================
  // 🔄 인증 상태 확인 (페이지 로드 시)
  // ============================================
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 백엔드에서 현재 사용자 정보 가져오기
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        // 인증 실패 시 로그아웃 상태 유지
        console.warn('인증 상태 확인 실패:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // ============================================
  // 🔐 로그인 함수
  // ============================================
  
  const login = (userData: User) => {
    setUser(userData);
  };

  // ============================================
  // 🚪 로그아웃 함수
  // ============================================
  
  const logout = async () => {
    try {
      // 백엔드 로그아웃 API 호출
      await logout();
      // 로컬 상태 업데이트
      setUser(null);
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error);
      // 에러 발생 시에도 로컬 상태는 업데이트
      setUser(null);
    }
  };


  // ============================================
  // 📦 컨텍스트 값
  // ============================================
  
  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// 🎯 커스텀 훅
// ============================================

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
