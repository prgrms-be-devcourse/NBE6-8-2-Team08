/**
 * 📋 지원서 API - ApplicationController와 완전 동기화
 * 백엔드 파일: ApplicationController.java
 */

import axios from 'axios';

// 환경변수 표준화 (.env 파일 기준)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 백엔드 DTO 타입들은 types/index.ts에서 가져옴
import { 
  ApplicationDetailResponse, 
  ApplicationStatusUpdateRequest, 
  ApplicationCreateRequest,
  ApiResponse,
  ApplicationEntity
} from '@/types';

// 호환성을 위해 Application 타입 재정의
export type Application = ApplicationEntity;

/**
 * ✅ 구현완료 - GET /applications/{id}
 * 백엔드: ApplicationController.getApplicationDetail(@PathVariable Long id)
 * 응답: ResponseEntity<ApiResponse<ApplicationDetailResponseDto>> (200 OK)
 */
export const getApplicationDetail = async (id: number): Promise<ApplicationDetailResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/applications/${id}`);
    return response.data.data; // ApiResponse<ApplicationDetailResponseDto>에서 data 추출
  } catch (error) {
    console.error('지원서 상세 조회 실패:', error);
    throw error;
  }
};

/**
 * ✅ 구현완료 - DELETE /applications/{id}
 * 백엔드: ApplicationController.deleteApplication(@PathVariable Long id)
 * 응답: ResponseEntity<ApiResponse<String>> (200 OK)
 */
export const deleteApplication = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/applications/${id}`);
  } catch (error) {
    console.error('지원서 삭제 실패:', error);
    throw error;
  }
};

/**
 * ✅ 구현완료 - PATCH /applications/{id}/status
 * 백엔드: ApplicationController.updateApplicationStatus()
 */
export const updateApplicationStatus = async (
  id: number, 
  updateData: ApplicationStatusUpdateRequest
): Promise<void> => {
  try {
    await axios.patch(`${API_BASE_URL}/applications/${id}/status`, updateData);
  } catch (error) {
    console.error('지원서 상태 업데이트 실패:', error);
    throw error;
  }
};

/**
 * ✅ 구현완료 - POST /applications
 * 백엔드: ApplicationController.createApplication() (추가 필요)
 */
export const createApplication = async (applicationData: ApplicationCreateRequest): Promise<ApplicationDetailResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/applications`, applicationData);
    return response.data.data;
  } catch (error) {
    console.error('지원서 생성 실패:', error);
    throw error;
  }
};
