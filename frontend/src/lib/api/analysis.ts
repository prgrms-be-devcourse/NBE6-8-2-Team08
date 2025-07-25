/**
 * 📊 분석 API - AnalysisController와 완전 동기화
 * 백엔드 파일: AnalysisController.java
 * 
 * 🔄 동기화 상태:
 * - ✅ GET /analysis/application/{applicationId} - 백엔드 구현완료
 * - ✅ POST /analysis/application/{applicationId} - 백엔드 구현완료
 * - ✅ POST /analysis/project/{projectId}/role-assignment - 백엔드 구현완료
 */

import axios from 'axios';

// 환경변수 표준화 (.env 파일 기준)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 📄 AnalysisResultResponse (백엔드 DTO와 완전 동일)
 * 백엔드 파일: AnalysisResultResponse.java
 * 
 * 백엔드 Record 구조:
 * - id: Long
 * - applicationId: Long 
 * - compatibilityScore: double
 * - compatibilityReason: String
 * 
 * 생성자: AnalysisResultResponse(AnalysisResult result)
 */
export interface AnalysisResultResponse {
  id: number;
  applicationId: number;
  compatibilityScore: number;
  compatibilityReason: string;
}

/**
 * ✅ 구현완료 - GET /analysis/application/{applicationId}
 * 백엔드: AnalysisController.getAnalysisResult(@PathVariable Long applicationId)
 * 응답: ResponseEntity<ApiResponse<AnalysisResultResponse>> (200 OK)
 * 
 * 백엔드 구현 내용:
 * 1. AnalysisService.getAnalysisResult(applicationId) 호출
 * 2. AnalysisResultResponse 생성자로 래핑
 * 3. ApiResponse로 "조회 성공" 메시지와 함께 반환
 */
export const getAnalysisResult = async (applicationId: number): Promise<AnalysisResultResponse> => {
  const response = await axios.get(`${API_BASE_URL}/analysis/application/${applicationId}`);
  return response.data.data; // ApiResponse<AnalysisResultResponse>에서 data 추출
};

/**
 * ✅ 구현완료 - POST /analysis/application/{applicationId}
 * 백엔드: AnalysisController.createAnalysisResult(@PathVariable Long applicationId)
 * 응답: ResponseEntity<ApiResponse<AnalysisResultResponse>> (201 CREATED)
 * 
 * 백엔드 구현 내용:
 * 1. AnalysisService.createAnalysisResult(applicationId) 호출
 * 2. AnalysisResultResponse 생성자로 래핑
 * 3. ApiResponse로 "분석 결과 생성 성공" 메시지와 함께 반환
 * 4. HTTP 상태 201 CREATED 사용
 */
export const createAnalysisResult = async (applicationId: number): Promise<AnalysisResultResponse> => {
  const response = await axios.post(`${API_BASE_URL}/analysis/application/${applicationId}`);
  return response.data.data; // ApiResponse<AnalysisResultResponse>에서 data 추출
};

/**
 * ✅ 구현완료 - POST /analysis/project/{projectId}/role-assignment
 * 백엔드: AnalysisController.createTeamRoleAssignment(@PathVariable Long projectId)
 * 응답: ResponseEntity<ApiResponse<String>> (201 CREATED)
 * 
 * 백엔드 구현 내용:
 * 1. AnalysisService.createTeamRoleAssignment(projectId) 호출
 * 2. String 타입 역할 분배 결과 반환
 * 3. ApiResponse로 "팀 역할 분배 완료" 메시지와 함께 반환
 * 4. HTTP 상태 201 CREATED 사용
 */
export const createTeamRoleAssignment = async (projectId: number): Promise<string> => {
  const response = await axios.post(`${API_BASE_URL}/analysis/project/${projectId}/role-assignment`);
  return response.data.data; // ApiResponse<String>에서 data 추출
};

/**
 * 📊 백엔드 구현 특징 분석:
 * 
 * 1. **일관된 응답 구조**: 모든 API가 ApiResponse<T> 래퍼 사용
 *    - msg: String (응답 메시지)
 *    - data: T (실제 데이터)
 * 
 * 2. **RESTful 설계**: 
 *    - GET: 조회 (200 OK)
 *    - POST: 생성 (201 CREATED)
 * 
 * 3. **서비스 레이어 분리**: 
 *    - 컨트롤러는 HTTP 처리만 담당
 *    - 실제 로직은 AnalysisService에서 처리
 * 
 * 4. **DTO 패턴 활용**:
 *    - Record 클래스로 불변 객체 구현
 *    - Entity에서 Response DTO로 변환하는 생성자 제공
 * 
 * 5. **PathVariable 사용**:
 *    - RESTful URL 설계 (/analysis/application/{id})
 *    - RequestBody 없이 ID만으로 처리 가능한 간단한 API
 */

// 기존 analysisApi 객체 스타일 대신 개별 함수로 변경하여 
// project.ts, auth.ts, user.ts와 동일한 패턴 적용