// 🏗️ PROJECT API - 백엔드 ProjectController 연동
import axios from 'axios';

// 환경변수 (.env 파일의 NEXT_PUBLIC_API_URL 사용)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ============================================
// 📝 백엔드 DTO 기반 타입 정의 (실제 Java 코드와 동일)
// ============================================

// 백엔드 ProjectCreateRequest.java 기반
interface ProjectCreateRequest {
  userId: number;        // long userId (백엔드)
  title: string;         // @Size(min = 1, max = 200) String title
  description: string;   // @Size(min = 1, max = 2000) String description  
  techStack: string;     // @Size(min = 1, max = 500) String techStack
  teamSize: number;      // @Min(1) int teamSize
  durationWeeks: number; // @Min(1) int durationWeeks
}

// 백엔드 ProjectDetailResponse.java 기반
interface ProjectDetailResponse {
  id: number;                // Long id
  title: string;             // String title
  description: string;       // String description
  techStacks: string[];      // List<String> techStacks
  teamSize: number;          // Integer teamSize
  currentTeamSize: number;   // Integer currentTeamSize
  creator: string;           // String creator
  status: string;            // String status
  content: string;           // String content
  createdAt: string;         // LocalDateTime createdAt (ISO 문자열로 전송)
}

// 백엔드 ProjectStatusUpdateRequest.java 기반
interface ProjectStatusUpdateRequest {
  status: string; // @Size(min = 1, max = 20) String status
}

// 백엔드 ProjectContentUpdateRequest.java 기반
interface ProjectContentUpdateRequest {
  content: string; // @Size(min = 1, max = 2000) String content
}

// 백엔드 ProjectApplyRequest.java 기반
interface ProjectApplyRequest {
  userId: number;        // @Min(1) Long userId
  techStacks: string[];  // List<String> techStacks
  techScores: number[];  // List<Integer> techScores
}

// 백엔드 ApiResponse.java 기반 공통 응답 타입
interface ApiResponse<T> {
  msg: string;  // String msg
  data: T;      // T data
}

// ============================================
// 🚀 API 함수들 (백엔드 ProjectController 메서드와 1:1 대응)
// ============================================

/**
 * ✅ 구현완료 - POST /projects
 * 백엔드: ProjectController.create(@RequestBody ProjectCreateRequest)
 * 응답: ResponseEntity<ApiResponse<ProjectDetailResponse>> (201 CREATED)
 */
export const createProject = async (projectData: ProjectCreateRequest): Promise<ProjectDetailResponse> => {
  const response = await axios.post(`${API_BASE_URL}/projects`, projectData);
  return response.data.data; // ApiResponse<ProjectDetailResponse>에서 data 추출
};

/**
 * ✅ 구현완료 - GET /projects  
 * 백엔드: ProjectController.getAll()
 * 응답: ResponseEntity<ApiResponse<List<ProjectDetailResponse>>> (200 OK)
 */
export const getAllProjects = async (): Promise<ProjectDetailResponse[]> => {
  const response = await axios.get(`${API_BASE_URL}/projects`);
  return response.data.data; // ApiResponse<List<ProjectDetailResponse>>에서 data 추출
};

/**
 * ✅ 구현완료 - GET /projects/{id}
 * 백엔드: ProjectController.get(@PathVariable Long id)  
 * 응답: ResponseEntity<ApiResponse<ProjectDetailResponse>> (200 OK)
 */
export const getProject = async (id: number): Promise<ProjectDetailResponse> => {
  const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
  return response.data.data; // ApiResponse<ProjectDetailResponse>에서 data 추출
};

/**
 * ✅ 구현완료 - PATCH /projects/{id}/status
 * 백엔드: ProjectController.modifyStatus(@PathVariable Long id, @RequestBody ProjectStatusUpdateRequest)
 * 응답: ResponseEntity<ApiResponse<ProjectDetailResponse>> (200 OK)
 */
export const updateProjectStatus = async (id: number, status: string): Promise<ProjectDetailResponse> => {
  const requestData: ProjectStatusUpdateRequest = { status };
  const response = await axios.patch(`${API_BASE_URL}/projects/${id}/status`, requestData);
  return response.data.data; // ApiResponse<ProjectDetailResponse>에서 data 추출
};

/**
 * ⚠️ 백엔드 부분구현 - PATCH /projects/{id}/content
 * 백엔드: ProjectController.modifyContent() - ResponseEntity.noContent().build() 반환중
 * 구현 필요: 실제 프로젝트 내용 수정 로직
 */
export const updateProjectContent = async (id: number, content: string): Promise<void> => {
  throw new Error('🚧 백엔드 구현 대기중 - PATCH /projects/{id}/content 엔드포인트 부분구현됨 (로직 없음)');
  // 구현 예정 코드:
  // const requestData: ProjectContentUpdateRequest = { content };
  // await axios.patch(`${API_BASE_URL}/projects/${id}/content`, requestData);
};

/**
 * ⚠️ 백엔드 부분구현 - DELETE /projects/{id}
 * 백엔드: ProjectController.delete() - ResponseEntity.noContent().build() 반환중
 * 구현 필요: 실제 프로젝트 삭제 로직
 */
export const deleteProject = async (id: number): Promise<void> => {
  throw new Error('🚧 백엔드 구현 대기중 - DELETE /projects/{id} 엔드포인트 부분구현됨 (로직 없음)');
  // 구현 예정 코드:
  // await axios.delete(`${API_BASE_URL}/projects/${id}`);
};

/**
 * ⚠️ 백엔드 부분구현 - GET /projects/{id}/applications
 * 백엔드: ProjectController.getApplications() - ResponseEntity.noContent().build() 반환중
 * 구현 필요: 프로젝트별 지원서 목록 조회 로직
 */
export const getProjectApplications = async (id: number): Promise<any[]> => {
  throw new Error('🚧 백엔드 구현 대기중 - GET /projects/{id}/applications 엔드포인트 부분구현됨 (로직 없음)');
  // 구현 예정 코드:
  // const response = await axios.get(`${API_BASE_URL}/projects/${id}/applications`);
  // return response.data.data; // ApiResponse<List<ApplicationDetailResponseDto>>에서 data 추출
};

/**
 * ⚠️ 백엔드 부분구현 - POST /projects/{id}/applications  
 * 백엔드: ProjectController.apply() - ResponseEntity.noContent().build() 반환중
 * 구현 필요: 프로젝트 지원 로직
 */
export const applyToProject = async (projectId: number, applicationData: ProjectApplyRequest): Promise<any> => {
  throw new Error('🚧 백엔드 구현 대기중 - POST /projects/{id}/applications 엔드포인트 부분구현됨 (로직 없음)');
  // 구현 예정 코드:
  // const response = await axios.post(`${API_BASE_URL}/projects/${projectId}/applications`, applicationData);
  // return response.data.data; // ApiResponse<ApplicationDetailResponseDto>에서 data 추출
};