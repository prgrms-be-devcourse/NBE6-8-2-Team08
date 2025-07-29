// 📂 공통 타입 정의 파일
// ⚠️ 주의: API 파일들(api/*)이 백엔드와 직접 동기화되므로, 
// 여기서는 API 파일에서 사용하지 않는 공통 타입들만 정의합니다.

// ============================================
// 🔄 공통 응답 형식 (모든 API에서 공통 사용)
// ============================================

// 백엔드 ApiResponse.java 기반 공통 응답 타입
export interface ApiResponse<T> {
  msg: string;  // String msg
  data: T;      // T data
}

// ============================================
// 👤 사용자 관련 공통 타입
// ============================================

// 기본 사용자 타입 (auth.ts에서 필요)
export interface User {
  id: number;
  name: string;
}

// 로그인 요청 타입 (auth.ts에서 필요)
export interface LoginRequest {
  username: string;
  password: string;
}

// 로그인 응답 타입 (auth.ts에서 필요)
export interface LoginResponse {
  token: string;
  user: User;
}

// 사용자 등록 DTO (user.ts에서 필요)
export interface UserRegisterDto {
  id: number;
  name: string;
}

// ============================================
// 🤖 분석 관련 공통 타입  
// ============================================

// 분석 결과 타입 (analysis.ts에서 필요)
export interface AnalysisResult {
  id: number;
  applicationId: number;
  compatibilityScore: number; // string에서 number로 변경
  compatibilityReason: string;
}

// 분석 결과 응답 타입 (analysis.ts에서 필요)
export interface AnalysisResultResponse {
  id: number;
  applicationId: number;
  compatibilityScore: number;
  compatibilityReason: string;
}

// ============================================
// 📊 엔티티 타입 (백엔드 엔티티 기반)
// ============================================

// 지원서 엔티티 (user.ts에서 필요)
export interface ApplicationEntity {
  id: number;
  userId: number;
  projectId: number;
  status: string;
  appliedAt: string;
}

// 지원서 상세 응답 DTO (application.ts에서 필요)
export interface ApplicationDetailResponse {
  id: number;
  user: {
    id: number;
    name: string;
  };
  status: string;
  appliedAt: string;
}

// 지원서 상태 업데이트 요청 타입 (application.ts에서 필요)
export interface ApplicationStatusUpdateRequest {
  status: string;
}

// 지원서 생성 요청 타입 (application.ts에서 필요)
export interface ApplicationCreateRequest {
  userId: number;
  projectId: number;
}

// 프로젝트 생성 요청 타입 (project.ts에서 필요)
export interface ProjectCreateRequest {
  userId: number;
  title: string;
  description: string;
  techStack: string; // 쉼표로 구분된 문자열
  teamSize: number;
  durationWeeks: number;
}

// 프로젝트 상세 응답 타입 (project.ts에서 필요)
export interface ProjectDetailResponse {
  id: number;
  title: string;
  description: string;
  techStacks: string[]; // 배열로 변환
  teamSize: number;
  currentTeamSize: number;
  creator: string;
  status: string;
  content: string;
  createdAt: string;
}

// 프로젝트 상태 업데이트 요청 타입 (project.ts에서 필요)
export interface ProjectStatusUpdateRequest {
  status: string;
}

// 프로젝트 내용 업데이트 요청 타입 (project.ts에서 필요)
export interface ProjectContentUpdateRequest {
  content: string;
}

// 프로젝트 지원 요청 타입 (project.ts에서 필요)
export interface ProjectApplyRequest {
  userId: number;
  techStacks: string[];
  techScores: number[];
}

// ============================================
// 🏷️ ENUM 타입들 (백엔드 enum과 동일)
// ============================================

// 지원서 상태 (백엔드 ApplicationStatus enum)
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// 프로젝트 상태 (백엔드 ProjectStatus enum)  
export type ProjectStatus = 'RECRUITING' | 'COMPLETED';

// ============================================
// 📝 참고사항
// ============================================
// - 각 API 파일이 백엔드 DTO와 직접 동기화되도록 구조화
