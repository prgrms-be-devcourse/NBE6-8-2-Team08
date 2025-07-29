// 🔐 AUTH API - 백엔드 AuthController 연동
// 인증/인가 관련 API 함수들 (로그인, 로그아웃, 세션 확인)

// 환경변수 (.env 파일의 NEXT_PUBLIC_API_URL 사용)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ============================================
// 📝 백엔드 DTO 기반 타입 정의 (실제 Java 코드와 동일)
// ============================================

// 백엔드 User 엔티티 기반 (types/index.ts에서 가져옴)
import { User, LoginRequest, LoginResponse, ApiResponse } from '@/types';

// ============================================
// 🚀 API 함수들 (백엔드 AuthController 메서드와 1:1 대응)
// ============================================

export const authApi = {
  /**
   * ⚠️ 백엔드 기본구현 - POST /auth/login
   * 백엔드: AuthController.login() - 단순 문자열 "login" 반환
   * 
   * 📝 현재 상태:
   * - 백엔드에서 단순히 "login" 문자열만 반환
   * - 실제 인증 로직, JWT 토큰, 세션 처리 등 미구현
   * - LoginRequest, LoginResponse DTO도 빈 클래스 상태
   * 
   * 🔧 백엔드 구현 필요사항:
   * 1. LoginRequest DTO에 username, password 필드 추가
   * 2. 실제 인증 로직 구현 (Spring Security)
   * 3. 세션 또는 JWT 토큰 기반 인증 시스템 구축
   * 4. LoginResponse DTO에 사용자 정보, 토큰 등 추가
   */
  login: async (): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 세션 쿠키 포함 (백엔드에서 세션 사용시)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 현재 백엔드는 단순 문자열 "login" 반환
      const result = await response.text();
      return result;
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  },

  /**
   * ⚠️ 백엔드 기본구현 - POST /auth/logout  
   * 백엔드: AuthController.logout() - 단순 문자열 "logout" 반환
   * 
   * 📝 현재 상태:
   * - 백엔드에서 단순히 "logout" 문자열만 반환
   * - 실제 세션 무효화, 토큰 블랙리스트 처리 등 미구현
   * 
   * 🔧 백엔드 구현 필요사항:
   * 1. 세션 무효화 로직 구현
   * 2. JWT 토큰 블랙리스트 처리 (JWT 사용시)
   * 3. 쿠키 삭제 처리
   */
  logout: async (): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // 세션 쿠키 포함
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 현재 백엔드는 단순 문자열 "logout" 반환
      const result = await response.text();
      return result;
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  },

  /**
   * ✅ 프론트엔드 구현완료 - GET /auth/me (또는 /auth/session)
   * 
   * 📝 필요한 이유:
   * - 페이지 새로고침 시 로그인 상태 확인용
   * - AuthContext에서 초기 로딩 시 사용
   * - 세션 만료 확인용
   * 
   * 🔧 백엔드 구현 필요사항:
   * 1. GET /auth/me 엔드포인트 추가
   * 2. 현재 세션의 사용자 정보 반환
   * 3. 인증되지 않은 경우 401 Unauthorized 반환
   * 4. 응답 형태: ApiResponse<User> 또는 User 직접 반환
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 401) {
        return null; // 인증되지 않음
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<User> = await response.json();
      return result.data;
    } catch (error) {
      console.error('현재 사용자 조회 실패:', error);
      return null;
    }
  },

  /**
   * ✅ 프론트엔드 구현완료 - POST /auth/login (실제 로그인)
   * 
   * 📝 실제 로그인 API (현재 login()과 다름)
   * 
   * 🔧 백엔드 구현 필요사항:
   * 1. LoginRequest DTO에 실제 로그인 필드 추가
   * 2. 사용자 인증 로직 구현
   * 3. 세션 생성 또는 JWT 토큰 발급
   * 4. 응답에 사용자 정보 포함
   */
  authenticateUser: async (loginData: LoginRequest): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error('로그인 실패');
      }

      const result: ApiResponse<User> = await response.json();
      return result.data;
    } catch (error) {
      console.error('사용자 인증 실패:', error);
      throw error;
    }
  },
};

// ============================================
// 🎯 사용 예시 (프론트엔드 개발자용 가이드)
// ============================================

/*
// AuthContext.tsx에서 사용 예시:

// 1. 초기 로그인 상태 확인
useEffect(() => {
  const checkAuth = async () => {
    try {
      const user = await authApi.getCurrentUser();
      if (user) {
        login(user);
      }
    } catch (error) {
      console.error('인증 확인 실패:', error);
    }
  };
  checkAuth();
}, []);

// 2. 로그인 처리
const handleLogin = async () => {
  try {
    // 현재 구현 (임시):
    const result = await authApi.login();
    console.log(result); // "login"
    
    // 실제 구현 시:
    // const user = await authApi.authenticateUser({ username, password });
    // login(user);
  } catch (error) {
    console.error('로그인 실패:', error);
  }
};

// 3. 로그아웃 처리  
const handleLogout = async () => {
  try {
    await authApi.logout();
    logout();
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
};
*/
