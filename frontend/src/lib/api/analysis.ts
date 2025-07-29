/**
 * 📊 분석 API - AnalysisController와 완전 동기화
 * 백엔드 파일: AnalysisController.java
 */

import axios from 'axios';

// 환경변수 표준화 (.env 파일 기준)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 백엔드 DTO 타입들은 types/index.ts에서 가져옴
import { 
  AnalysisResultResponse,
  ApiResponse
} from '@/types';

/**
 * ✅ 구현완료 - GET /analysis/application/{applicationId}
 * 백엔드: AnalysisController.getAnalysisResult(@PathVariable Long applicationId)
 * 응답: ResponseEntity<ApiResponse<AnalysisResultResponse>> (200 OK)
 */
export const getAnalysisResult = async (applicationId: number): Promise<AnalysisResultResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analysis/application/${applicationId}`);
    return response.data.data; // ApiResponse<AnalysisResultResponse>에서 data 추출
  } catch (error) {
    console.error('분석 결과 조회 실패:', error);
    throw error;
  }
};

/**
 * ✅ 구현완료 - POST /analysis/application/{applicationId}
 * 백엔드: AnalysisController.createAnalysisResult(@PathVariable Long applicationId)
 * 응답: ResponseEntity<ApiResponse<AnalysisResultResponse>> (201 CREATED)
 */
export const createAnalysisResult = async (applicationId: number): Promise<AnalysisResultResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analysis/application/${applicationId}`);
    return response.data.data; // ApiResponse<AnalysisResultResponse>에서 data 추출
  } catch (error) {
    console.error('분석 결과 생성 실패:', error);
    throw error;
  }
};

/**
 * ✅ 구현완료 - POST /analysis/project/{projectId}/role-assignment
 * 백엔드: AnalysisController.createTeamRoleAssignment(@PathVariable Long projectId)
 * 응답: ResponseEntity<ApiResponse<String>> (201 CREATED)
 */
export const createTeamRoleAssignment = async (projectId: number): Promise<string> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analysis/project/${projectId}/role-assignment`);
    return response.data.data; // ApiResponse<String>에서 data 추출
  } catch (error) {
    console.error('팀 역할 분배 실패:', error);
    throw error;
  }
};
