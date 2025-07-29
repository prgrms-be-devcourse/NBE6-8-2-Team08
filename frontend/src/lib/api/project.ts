// 🏗️ PROJECT API - 백엔드 ProjectController 연동
import axios from 'axios';

// 환경변수 (.env 파일의 NEXT_PUBLIC_API_URL 사용)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ============================================
// 📝 백엔드 DTO 기반 타입 정의 (실제 Java 코드와 동일)
// ============================================

// 백엔드 DTO 타입들은 types/index.ts에서 가져옴
import { 
  ProjectCreateRequest, 
  ProjectDetailResponse as ProjectDetail, 
  ProjectStatusUpdateRequest, 
  ProjectContentUpdateRequest, 
  ProjectApplyRequest,
  ApiResponse
} from '@/types';

// ProjectDetailResponse를 호환성을 위해 재정의
export type ProjectDetailResponse = ProjectDetail;

// ============================================
// 🚀 API 함수들 (백엔드 ProjectController 메서드와 1:1 대응)
// ============================================

/**
 * ✅ 구현완료 - POST /projects
 * 백엔드: ProjectController.create(@RequestBody ProjectCreateRequest)
 * 응답: ResponseEntity<ApiResponse<ProjectDetailResponse>> (201 CREATED)
 */
export const createProject = async (projectData: ProjectCreateRequest): Promise<ProjectDetailResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/projects`, projectData);
    return response.data.data; // ApiResponse<ProjectDetailResponse>에서 data 추출
  } catch (error) {
    console.error('프로젝트 생성 실패:', error);
    throw error;
  }
};

/**
 * ✅ 구현완료 - GET /projects  
 * 백엔드: ProjectController.getAll()
 * 응답: ResponseEntity<ApiResponse<List<ProjectDetailResponse>>> (200 OK)
 */
export const getAllProjects = async (): Promise<ProjectDetailResponse[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects`);
    return response.data.data; // ApiResponse<List<ProjectDetailResponse>>에서 data 추출
  } catch (error) {
    console.error('전체 프로젝트 조회 실패:', error);
    throw error;
  }
};

/**
 * ✅ 구현완료 - GET /projects/{id}
 * 백엔드: ProjectController.get(@PathVariable Long id)  
 * 응답: ResponseEntity<ApiResponse<ProjectDetailResponse>> (200 OK)
 */
export const getProject = async (id: number): Promise<ProjectDetailResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
    return response.data.data; // ApiResponse<ProjectDetailResponse>에서 data 추출
  } catch (error) {
    console.error('프로젝트 상세 조회 실패:', error);
    throw error;
  }
};

/**
 * ✅ 구현완료 - PATCH /projects/{id}/status
 * 백엔드: ProjectController.modifyStatus(@PathVariable Long id, @RequestBody ProjectStatusUpdateRequest)
 * 응답: ResponseEntity<ApiResponse<ProjectDetailResponse>> (200 OK)
 */
export const updateProjectStatus = async (id: number, status: string): Promise<ProjectDetailResponse> => {
  try {
    const requestData: ProjectStatusUpdateRequest = { status };
    const response = await axios.patch(`${API_BASE_URL}/projects/${id}/status`, requestData);
    return response.data.data; // ApiResponse<ProjectDetailResponse>에서 data 추출
  } catch (error) {
    console.error('프로젝트 상태 수정 실패:', error);
    throw error;
  }
};

/**
 * ⚠️ 백엔드 부분구현 - PATCH /projects/{id}/content
 * 백엔드: ProjectController.modifyContent() - ResponseEntity.noContent().build() 반환중
 * 구현 필요: 실제 프로젝트 내용 수정 로직
 */
export const updateProjectContent = async (id: number, content: string): Promise<void> => {
  try {
    const requestData: ProjectContentUpdateRequest = { content };
    await axios.patch(`${API_BASE_URL}/projects/${id}/content`, requestData);
  } catch (error) {
    console.error('프로젝트 내용 수정 실패:', error);
    throw error;
  }
};

/**
 * ⚠️ 백엔드 부분구현 - DELETE /projects/{id}
 * 백엔드: ProjectController.delete() - ResponseEntity.noContent().build() 반환중
 * 구현 필요: 실제 프로젝트 삭제 로직
 */
export const deleteProject = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/projects/${id}`);
  } catch (error) {
    console.error('프로젝트 삭제 실패:', error);
    throw error;
  }
};

/**
 * ⚠️ 백엔드 부분구현 - GET /projects/{id}/applications
 * 백엔드: ProjectController.getApplications() - ResponseEntity.noContent().build() 반환중
 * 구현 필요: 프로젝트별 지원서 목록 조회 로직
 */
export const getProjectApplications = async (id: number): Promise<unknown[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects/${id}/applications`);
    return response.data.data; // ApiResponse<List<ApplicationDetailResponseDto>>에서 data 추출
  } catch (error) {
    console.error('프로젝트별 지원서 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * ⚠️ 백엔드 부분구현 - POST /projects/{id}/applications  
 * 백엔드: ProjectController.apply() - ResponseEntity.noContent().build() 반환중
 * 구현 필요: 프로젝트 지원 로직
 */
export const applyToProject = async (projectId: number, applicationData: ProjectApplyRequest): Promise<unknown> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/projects/${projectId}/applications`, applicationData);
    return response.data.data; // ApiResponse<ApplicationDetailResponseDto>에서 data 추출
  } catch (error) {
    console.error('프로젝트 지원 실패:', error);
    throw error;
  }
};
