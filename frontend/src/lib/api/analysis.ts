// ============================================
// 🤖 분석 관련 API 함수들
// ============================================

import { apiClient } from './index';
import { 
  AnalysisResultResponse, 
  TeamRoleAssignmentResponse, 
  TeamRoleAssignmentRequest 
} from '@/types';

// ============================================
// 🎯 API 엔드포인트 상수들
// ============================================

const ANALYSIS_ENDPOINT = '/analysis';

// ============================================
// 📡 분석 API 함수들 (백엔드 컨트롤러와 1:1 매칭)
// ============================================

/**
 * 📊 분석 결과 조회
 * 
 * 📡 백엔드 API: GET /analysis/{id}
 * 🏠 컨트롤러: AnalysisController.getById()
 * 📦 응답: AnalysisResultResponse
 */
export const getAnalysisResult = async (id: number): Promise<AnalysisResultResponse> => {
  try {
    const response = await apiClient.get(`${ANALYSIS_ENDPOINT}/${id}`);
    console.log(`📤 [Analysis API] 분석 결과 조회 요청 (ID: ${id})`);
    return response.data.data;
  } catch (error) {
    console.error(`❌ [Analysis API] 분석 결과 조회 실패 (ID: ${id}):`, error);
    throw error;
  }
};

/**
 * 👥 팀 역할 할당
 * 
 * 📡 백엔드 API: POST /analysis/assign-roles
 * 🏠 컨트롤러: AnalysisController.assignRoles()
 * 📦 요청: TeamRoleAssignmentRequest
 * 📦 응답: TeamRoleAssignmentResponse
 */
export const assignTeamRoles = async (data: TeamRoleAssignmentRequest): Promise<TeamRoleAssignmentResponse> => {
  try {
    const response = await apiClient.post(`${ANALYSIS_ENDPOINT}/assign-roles`, data);
    console.log('📤 [Analysis API] 팀 역할 할당 요청:', data);
    return response.data.data;
  } catch (error) {
    console.error('❌ [Analysis API] 팀 역할 할당 실패:', error);
    throw error;
  }
};
