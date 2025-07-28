/**
 * 📋 지원서 API - ApplicationController와 완전 동기화
 * 백엔드 파일: ApplicationController.java
 * 
 * 🔄 동기화 상태:
 * - ✅ GET /applications/{id} - 백엔드 구현완료
 * - ✅ PUT /applications/{id}/status - 프론트엔드 구현완료
 * - ✅ POST /applications - 프론트엔드 구현완료
 */

import axios from 'axios';

// 환경변수 표준화 (.env 파일 기준)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 📄 ApplicationDetailResponseDto (백엔드 DTO와 완전 동일)
 * 백엔드 파일: ApplicationDetailResponseDto.java
 * 
 * 백엔드 응답 구조:
 * - id: Long
 * - user: UserSimpleResponseDto { id: Long, name: String }
 * - status: ApplicationStatus enum
 * - appliedAt: LocalDateTime
 */
export interface ApplicationDetailResponse {
  id: number;
  user: {
    id: number;
    name: string;
  };
  status: string;
  appliedAt: string;
}

/**
 * 📄 ApplicationStatusUpdateRequest (백엔드 DTO 기준)
 * 백엔드 파일: ApplicationStatusUpdateRequest.java
 * 현재 상태: 빈 클래스 (필드 미정의)
 */
export interface ApplicationStatusUpdateRequest {
  status: string;
}

/**
 * 📄 ApplicationCreateRequest (백엔드 DTO 기준)
 * 백엔드 파일: ApplicationCreateRequestDto.java
 * 
 * 백엔드 요청 구조:
 * - projectId: Long
 * - skillScores: List<SkillScoreRequest> (기술 스택별 점수)
 */
export interface ApplicationCreateRequest {
  projectId: number;
  skillScores: Array<{
    techName: string;
    score: number;
  }>;
}

/**
 * ✅ 구현완료 - GET /applications/{id}
 * 백엔드: ApplicationController.getApplicationDetail(@PathVariable Long id)
 * 응답: ResponseEntity<ApiResponse<ApplicationDetailResponseDto>> (200 OK)
 * 
 * 백엔드 구현 내용:
 * - ApplicationService.getApplicationDetailById() 호출
 * - ApplicationDetailResponseDto로 래핑
 * - ApiResponse로 한번 더 래핑하여 반환
 */
export const getApplicationDetail = async (id: number): Promise<ApplicationDetailResponse> => {
  const response = await axios.get(`${API_BASE_URL}/applications/${id}`);
  return response.data.data; // ApiResponse<ApplicationDetailResponseDto>에서 data 추출
};

/**
 * ✅ 구현완료 - DELETE /applications/{id}
 * 백엔드: ApplicationController.deleteApplication(@PathVariable Long id)
 * 응답: ResponseEntity<ApiResponse<String>> (200 OK)
 * 
 * 백엔드 구현 내용:
 * - ApplicationService.deleteApplicationById() 호출
 * - "지원서 삭제 성공" 메시지 반환
 */
export const deleteApplication = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/applications/${id}`);
  // 응답은 ApiResponse<String>이지만 삭제는 void 처리
};

/**
 * ✅ 프론트엔드 구현완료 - PUT /applications/{id}/status
 * 백엔드: ApplicationController.updateApplicationStatus()
 * 
 * 구현 내용:
 * 1. ApplicationStatusUpdateRequest DTO에 status 필드 정의
 * 2. 지원서 상태 업데이트 API 연동
 */
export const updateApplicationStatus = async (
  id: number, 
  updateData: ApplicationStatusUpdateRequest
): Promise<void> => {
  await axios.put(`${API_BASE_URL}/applications/${id}/status`, updateData);
};

/**
 * ✅ 프론트엔드 구현완료 - POST /applications
 * 백엔드: ApplicationController.createApplication() (추가 필요)
 * 
 * 구현 내용:
 * 1. ApplicationCreateRequest DTO 정의
 * 2. 지원서 생성 API 연동
 */
export const createApplication = async (applicationData: ApplicationCreateRequest): Promise<ApplicationDetailResponse> => {
  const response = await axios.post(`${API_BASE_URL}/applications`, applicationData);
  return response.data.data;
};

/**
 * 📋 구현 우선순위 제안:
 * 
 * 1. 백엔드 ApplicationController에 createApplication 메서드 추가
 * 2. ApplicationCreateRequestDto 백엔드 DTO 구현
 * 3. ApplicationService에 createApplication 로직 구현
 */
