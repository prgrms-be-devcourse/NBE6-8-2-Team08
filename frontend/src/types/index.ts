// ============================================
// 📦 공통 응답 타입 (백엔드 ApiResponse와 100% 동기화)
// ============================================

/**
 * 📡 백엔드 공통 응답 형식
 * 
 * 📍 위치: backend/src/main/java/com/devmatch/backend/global/ApiResponse.java
 * 🎯 목적: 모든 API 응답에 일관된 형식 적용
 * 📦 구조: { msg: string, data: T }
 * 
 * 📝 예시:
 * {
 *   "msg": "프로젝트 생성 성공",           // ✅ 메시지
 *   "data": {                           // ✅ 실제 데이터 (제네릭)
 *     "id": 1,
 *     "title": "새 프로젝트",
 *     ...
 *   }
 * }
 */
export interface ApiResponse<T> {
  msg: string;  // ✅ 응답 메시지 (성공/실패 여부)
  data: T;      // ✅ 실제 응답 데이터 (제네릭 타입)
}

// ============================================
// 👤 사용자 관련 타입들
// ============================================

/**
 * 👤 사용자 기본 정보
 * 
 * 📍 위치: backend/src/main/java/com/devmatch/backend/domain/user/entity/User.java
 * 🎯 목적: 사용자 식별 및 기본 정보 제공
 */
export interface User {
  id: number;           // ✅ 사용자 고유 ID (PK)
  username: string;     // ✅ 사용자 아이디 (OAuth 제공자별 고유값)
  nickname: string;     // ✅ 사용자 닉네임 (표시용)
  profileImgUrl: string; // ✅ 프로필 이미지 URL
}

// ============================================
// 📊 프로젝트 관련 타입들 (백엔드 Project 엔티티와 100% 동기화)
// ============================================

/**
 * 📋 프로젝트 상태 열거형
 * 
 * 📍 위치: backend/src/main/java/com/devmatch/backend/domain/project/entity/ProjectStatus.java
 * 🎯 목적: 프로젝트 진행 상태 표준화
 */
export type ProjectStatus = 'RECRUITING' | 'IN_PROGRESS' | 'COMPLETED';

/**
 * 📋 프로젝트 상세 정보 응답
 * 
 * 📍 위치: backend/src/main/java/com/devmatch/backend/domain/project/dto/ProjectDetailResponse.java
 * 🎯 목적: 프로젝트 조회 시 사용 (단일/목록 조회 모두 사용)
 * 📡 연관 API: GET /projects, GET /projects/{id}, GET /users/{id}/projects
 */
export interface ProjectDetailResponse {
  id: number;              // ✅ 프로젝트 고유 ID (PK)
  title: string;           // ✅ 프로젝트 제목
  description: string;     // ✅ 프로젝트 설명
  techStacks: string[];    // ✅ 기술 스택 목록 (쉼표 구분자로 파싱)
  teamSize: number;        // ✅ 목표 팀원 수
  currentTeamSize: number; // ✅ 현재 팀원 수
  creator: {
    id: number;
    username: string;
    nickname: string;
    profileImgUrl: string;
  };         // ✅ 생성자 정보
  status: ProjectStatus;   // ✅ 프로젝트 상태
  content: string;         // ✅ 프로젝트 상세 내용
  createdAt: string;       // ✅ 생성일시 (ISO 8601)
  durationWeeks: number;   // ✅ 예상 진행 기간 (주 단위)
}

/**
 * ➕ 프로젝트 생성 요청
 * 
 * 📍 위치: backend/src/main/java/com/devmatch/backend/domain/project/dto/ProjectCreateRequest.java
 * 🎯 목적: 프로젝트 생성 시 사용
 * 📡 연관 API: POST /projects
 */
export interface ProjectCreateRequest {
  userId: number;       // ✅ 생성자 사용자 ID
  title: string;        // ✅ 프로젝트 제목
  description: string;  // ✅ 프로젝트 설명
  techStack: string;    // ✅ 기술 스택 (쉼표 구분자 문자열)
  teamSize: number;     // ✅ 목표 팀원 수
  durationWeeks: number; // ✅ 예상 진행 기간 (주 단위)
}

/**
 * 🔄 프로젝트 상태 변경 요청
 * 
 * 📍 위치: backend/src/main/java/com/devmatch/backend/domain/project/dto/ProjectStatusUpdateRequest.java
 * 🎯 목적: 프로젝트 상태 변경 시 사용
 * 📡 연관 API: PATCH /projects/{id}/status
 */
export interface ProjectStatusUpdateRequest {
  status: ProjectStatus; // ✅ 변경할 프로젝트 상태
}

/**
 * 🔄 프로젝트 내용 변경 요청
 * 
 * 📍 위치: backend/src/main/java/com/devmatch/backend/domain/project/dto/ProjectContentUpdateRequest.java
 * 🎯 목적: 프로젝트 상세 내용 변경 시 사용
 * 📡 연관 API: PATCH /projects/{id}/content
 */
export interface ProjectContentUpdateRequest {
  content: string; // ✅ 변경할 프로젝트 상세 내용
}

// ============================================
// 📋 지원서 관련 타입들 (백엔드 Application 엔티티와 100% 동기화)
// ============================================

/**
 * 📋 지원서 상태 열거형
 * 
 * 📍 위치: backend/src/main/java/com/devmatch/backend/domain/application/entity/ApplicationStatus.java
 * 🎯 목적: 지원서 처리 상태 표준화
 */
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

/**
 * 📋 사용자의 지원서 목록 응답
 * 
 * 📍 위치: backend/src/main/java/com/devmatch/backend/domain/user/dto/UserApplicationListResponse.java
 * 🎯 목적: 사용자의 지원서 목록 조회 시 사용
 * 📡 연관 API: GET /users/{id}/applications
 */
export interface UserApplicationListResponse {
  applicationId: number;        // ✅ 지원서 고유 ID
  user: User;                   // ✅ 지원자 정보
  status: ApplicationStatus;    // ✅ 지원서 상태
  appliedAt: string;            // ✅ 지원일시 (ISO 8601)
}

/**
 * 📋 프로젝트의 지원서 목록 응답
 * 
 * 📍 위치: backend/src/main/java/com/devmatch/backend/domain/project/dto/ProjectApplicationListResponse.java
 * 🎯 목적: 프로젝트의 지원서 목록 조회 시 사용
 * 📡 연관 API: GET /projects/{id}/applications
 */
export interface ProjectApplicationListResponse {
  applicationId: number;        // ✅ 지원서 고유 ID
  user: User;                   // ✅ 지원자 정보
  status: ApplicationStatus;    // ✅ 지원서 상태
  appliedAt: string;            // ✅ 지원일시 (ISO 8601)
}

/**
 * ➕ 프로젝트 지원 요청
 * 
 * 📍 위치: backend/src/main/java/com/devmatch/backend/domain/project/dto/ProjectApplyRequest.java
 * 🎯 목적: 프로젝트 지원 시 사용
 * 📡 연관 API: POST /projects/{id}/applications
 */
export interface ProjectApplyRequest {
  userId: number;       // ✅ 지원자 사용자 ID
  techStacks: string;   // ✅ 지원자의 기술 스택 (쉼표 구분자 문자열)
  techScores: number[]; // ✅ 기술별 점수 배열
}


/**
 * 📋 지원서 상세 정보 응답
 * 
 * 📍 위치: backend/src/main/java/com/devmatch/backend/domain/application/dto/ApplicationDetailResponse.java
 * 🎯 목적: 지원서 상세 조회 시 사용
 * 📡 연관 API: GET /applications/{id}
 */
export interface ApplicationDetailResponse {
  applicationId: number;        // ✅ 지원서 고유 ID
  user: User;                   // ✅ 지원자 정보
  status: ApplicationStatus;    // ✅ 지원서 상태
  appliedAt: string;            // ✅ 지원일시 (ISO 8601)
}

/**
 * 🔄 지원서 상태 변경 요청
 * 
 * 📍 위치: backend/src/main/java/com/devmatch/backend/domain/application/dto/ApplicationStatusUpdateRequest.java
 * 🎯 목적: 지원서 상태 변경 시 사용
 * 📡 연관 API: PATCH /applications/{id}/status
 */
export interface ApplicationStatusUpdateRequest {
  status: ApplicationStatus; // ✅ 변경할 지원서 상태
}

// ============================================
// 📊 분석 관련 타입들 (백엔드 Analysis 엔티티와 100% 동기화)
// ============================================

/**
 * 📋 분석 결과 응답
 * 
 * 📍 위치: backend/src/main/java/com/devmatch/backend/domain/analysis/dto/AnalysisResultResponse.java
 * 🎯 목적: 지원서 분석 결과 조회 시 사용
 * 📡 연관 API: GET /analysis/{id}
 */
export interface AnalysisResultResponse {
  analysisId: number;           // ✅ 분석 고유 ID
  applicationId: number;        // ✅ 분석 대상 지원서 ID
  compatibilityScore: number;   // ✅ 적합도 점수 (0-100)
  recommendedRole: string;      // ✅ 추천 역할
  strengths: string[];          // ✅ 강점 목록
  weaknesses: string[];         // ✅ 약점 목록
  createdAt: string;            // ✅ 분석일시 (ISO 8601)
}

/**
 * 🔄 팀 역할 할당 요청
 * 
 * 📍 위치: backend/src/main/java/com/devmatch/backend/domain/analysis/dto/TeamRoleAssignmentRequest.java
 * 🎯 목적: 팀원 역할 할당 시 사용
 * 📡 연관 API: POST /analysis/assign-roles
 */
export interface TeamRoleAssignmentRequest {
  projectId: number;   // ✅ 프로젝트 ID
  userIds: number[];   // ✅ 역할 할당 대상 사용자 ID 배열
}

/**
 * 📋 팀 역할 할당 응답
 * 
 * 📍 위치: backend/src/main/java/com/devmatch/backend/domain/analysis/dto/TeamRoleAssignmentResponse.java
 * 🎯 목적: 팀원 역할 할당 결과 조회 시 사용
 * 📡 연관 API: POST /analysis/assign-roles
 */
export interface TeamRoleAssignmentResponse {
  assignments: Array<{  // ✅ 역할 할당 결과 목록
    userId: number;     // ✅ 사용자 ID
    role: string;       // ✅ 할당된 역할
  }>;
  projectId: number;    // ✅ 프로젝트 ID
}

// ============================================
// 📦 사용자 정의 타입들
// ============================================

/**
 * 👤 사용자의 프로젝트 목록 응답
 * 
 * 📍 위치: backend/src/main/java/com/devmatch/backend/domain/user/dto/UserProjectListResponse.java
 * 🎯 목적: 사용자의 프로젝트 목록 조회 시 사용
 * 📡 연관 API: GET /users/{id}/projects
 * 
 * 📝 ProjectDetailResponse와 필드가 거의 동일하지만
 *    엔티티 분리와 확장성을 위해 별도 정의
 */
export interface UserProjectListResponse {
  id: number;              // ✅ 프로젝트 고유 ID (PK)
  title: string;           // ✅ 프로젝트 제목
  description: string;     // ✅ 프로젝트 설명
  techStacks: string[];    // ✅ 기술 스택 목록 (쉼표 구분자로 파싱)
  teamSize: number;        // ✅ 목표 팀원 수
  currentTeamSize: number; // ✅ 현재 팀원 수
  creator: {
    id: number;
    username: string;
    nickname: string;
    profileImgUrl: string;
  };         // ✅ 생성자 정보
  status: ProjectStatus;   // ✅ 프로젝트 상태
  content: string;         // ✅ 프로젝트 상세 내용
  createdAt: string;       // ✅ 생성일시 (ISO 8601)
  durationWeeks: number;   // ✅ 예상 진행 기간 (주 단위)
}
