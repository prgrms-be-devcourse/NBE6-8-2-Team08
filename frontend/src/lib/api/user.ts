// ============================================
// 👤 사용자 관련 API 함수들
// ============================================

import { apiClient } from './index';
import { User, UserProjectListResponse, UserApplicationListResponse } from '@/types';

// ============================================
// 🎯 API 엔드포인트 상수들
// ============================================

const USERS_ENDPOINT = '/users';

// ============================================
// 📡 사용자 API 함수들 (백엔드 컨트롤러와 1:1 매칭)
// ============================================

/**
 * 👤 현재 사용자 정보 조회
 * 
 * 📡 백엔드 API: GET /users/me
 * 🏠 컨트롤러: UserController.getMyInfo()
 * 📦 응답: User
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get('/users/me');
    console.log('📤 [User API] 현재 사용자 정보 조회 요청');
    return response.data.data;
  } catch (error) {
    console.error('❌ [User API] 현재 사용자 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 🚪 로그아웃
 * 
 * 📡 백엔드 API: DELETE /auth/logout
 * 🏠 컨트롤러: AuthController.logout()
 * 📦 응답: void (성공 시 204 No Content)
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.delete('/auth/logout');
    console.log('📤 [User API] 로그아웃 요청');
  } catch (error) {
    console.error('❌ [User API] 로그아웃 실패:', error);
    throw error;
  }
};


/**
 * 📊 사용자의 프로젝트 목록 조회
 * 
 * 📡 백엔드 API: GET /users/{id}/projects
 * 🏠 컨트롤러: UserController.getProjects()
 * 📦 응답: List<UserProjectListResponse>
 */
export const getUserProjects = async (id: number): Promise<UserProjectListResponse[]> => {
  try {
    const response = await apiClient.get(`${USERS_ENDPOINT}/${id}/projects`);
    console.log(`📤 [User API] 사용자 프로젝트 목록 조회 요청 (ID: ${id})`);
    return response.data.data;
  } catch (error) {
    console.error(`❌ [User API] 사용자 프로젝트 목록 조회 실패 (ID: ${id}):`, error);
    throw error;
  }
};

/**
 * 📋 사용자의 지원서 목록 조회
 * 
 * 📡 백엔드 API: GET /users/{id}/applications
 * 🏠 컨트롤러: UserController.getApplications()
 * 📦 응답: List<UserApplicationListResponse>
 */
export const getUserApplications = async (id: number): Promise<UserApplicationListResponse[]> => {
  try {
    const response = await apiClient.get(`${USERS_ENDPOINT}/${id}/applications`);
    console.log(`📤 [User API] 사용자 지원서 목록 조회 요청 (ID: ${id})`);
    return response.data.data;
  } catch (error) {
    console.error(`❌ [User API] 사용자 지원서 목록 조회 실패 (ID: ${id}):`, error);
    throw error;
  }
};
