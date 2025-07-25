/**
 * 📋 지원서 API - ApplicationController와 완전 동기화
 * 백엔드 파일: ApplicationController.java
 * 
 * 🔄 동기화 상태:
 * - ✅ GET /applications/{id} - 백엔드 구현완료
 * - ❌ POST /applications/{id}/status - 백엔드 미구현 (DTO만 존재)
 * - ❌ 지원서 생성 API - 백엔드 완전 미구현
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
  // ⚠️ 백엔드에서 필드 정의 필요
  status?: string;
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
 * ❌ 백엔드 기본구현 - PUT /applications/{id}/status
 * 백엔드: ApplicationController.updateApplicationStatus()
 * 현재 상태: ApplicationStatusUpdateRequest DTO가 빈 클래스
 * 
 * 문제점:
 * 1. ApplicationStatusUpdateRequest에 필드 정의 안됨
 * 2. 실제 상태 업데이트 로직 미구현
 * 3. 어떤 상태값들이 유효한지 불명확
 */
export const updateApplicationStatus = async (
  id: number, 
  updateData: ApplicationStatusUpdateRequest
): Promise<void> => {
  // ⚠️ 현재 백엔드 DTO가 비어있어서 어떤 데이터를 보내야 하는지 불명확
  const response = await axios.put(`${API_BASE_URL}/applications/${id}/status`, updateData);
  // 예상 응답: ApiResponse<String> 하지만 실제 구현 필요
};

/**
 * ❌ 백엔드 완전 미구현 - POST /applications
 * 예상 엔드포인트: ApplicationController.createApplication()
 * 
 * 미구현 사항:
 * 1. 컨트롤러 메서드 자체가 존재하지 않음
 * 2. 지원서 생성 DTO 없음
 * 3. 어떤 프로젝트에 지원하는 API인지 불명확
 */
export const createApplication = async (applicationData: any): Promise<ApplicationDetailResponse> => {
  throw new Error('❌ 백엔드 미구현: 지원서 생성 API가 아직 구현되지 않았습니다.');
  
  // 예상 구현:
  // const response = await axios.post(`${API_BASE_URL}/applications`, applicationData);
  // return response.data.data;
};

/**
 * 📋 구현 우선순위 제안:
 * 
 * 1. ApplicationStatusUpdateRequest DTO 필드 정의
 *    - status: ApplicationStatus enum 값
 * 
 * 2. updateApplicationStatus 실제 로직 구현
 *    - 지원서 상태 변경 (PENDING, APPROVED, REJECTED 등)
 * 
 * 3. createApplication API 전체 구현
 *    - ApplicationCreateRequest DTO 생성
 *    - 프로젝트 ID와 연결하는 로직
 *    - 중복 지원 방지 로직
 */