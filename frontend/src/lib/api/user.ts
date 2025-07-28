// 👤 USER API - 백엔드 UserController 연동  
// 사용자 관련 API 함수들 (등록, 조회, 프로젝트/지원서 목록)

import axios from 'axios';

// 환경변수 (.env 파일의 NEXT_PUBLIC_API_URL 사용)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ============================================
// 📝 백엔드 DTO 기반 타입 정의 (실제 Java 코드와 동일)
// ============================================

// 백엔드 UserRegisterDto.java 기반
interface UserRegisterDto {
  id: number;   // Long id
  name: string; // String name
}

// 백엔드 ProjectDetailResponse.java 기반 (project.ts와 동일)
export interface ProjectDetailResponse {
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

// 백엔드 Application 엔티티 기반 (types/index.ts의 ApplicationEntity와 동일)
export interface Application {
  id: number;        // Long id
  userId: number;    // Long userId (User 엔티티 FK)
  projectId: number; // Long projectId (Project 엔티티 FK)
  status: string;    // ApplicationStatus enum -> String
  appliedAt: string; // LocalDateTime appliedAt (ISO 문자열로 전송)
}

// 백엔드 ApiResponse.java 기반 공통 응답 타입
interface ApiResponse<T> {
  msg: string;  // String msg
  data: T;      // T data
}

// ============================================
// 🚀 API 함수들 (백엔드 UserController 메서드와 1:1 대응)
// ============================================

/**
 * ✅ 구현완료 - POST /users/register
 * 백엔드: UserController.register(@RequestBody String name)
 * 응답: ResponseEntity<ApiResponse<UserRegisterDto>> (201 CREATED)
 * 
 * 📝 주의사항:
 * - 백엔드에서 @RequestBody String name으로 받음 (객체가 아닌 문자열)
 * - 프론트에서는 JSON 문자열로 직접 전송해야 함
 * - Content-Type: application/json 헤더 필수
 */
export const registerUser = async (name: string): Promise<UserRegisterDto> => {
  const response = await axios.post(`${API_BASE_URL}/users/register`, name, {
    headers: {
      'Content-Type': 'application/json' // 백엔드 @RequestBody String 처리용
    }
  });
  return response.data.data; // ApiResponse<UserRegisterDto>에서 data 추출
};

/**
 * ✅ 구현완료 - GET /users/{id}/projects
 * 백엔드: UserController.findProjectsById(@PathVariable long id)
 * 응답: List<ProjectDetailResponse> (ApiResponse 래핑 없이 직접 반환)
 * 
 * 📝 주의사항:
 * - 백엔드에서 ApiResponse로 래핑하지 않고 List 직접 반환
 * - response.data로 바로 접근 (response.data.data 아님)
 */
export const getUserProjects = async (userId: number): Promise<ProjectDetailResponse[]> => {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}/projects`);
  return response.data; // List<ProjectDetailResponse> 직접 반환
};

/**
 * ✅ 구현완료 - GET /users/{id}/applications  
 * 백엔드: UserController.findApplicationsById(@PathVariable long id)
 * 응답: List<Application> (ApiResponse 래핑 없이 직접 반환)
 * 
 * 📝 주의사항:
 * - 백엔드에서 ApiResponse로 래핑하지 않고 List 직접 반환
 * - response.data로 바로 접근 (response.data.data 아님)
 */
export const getUserApplications = async (userId: number): Promise<Application[]> => {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}/applications`);
  return response.data; // List<Application> 직접 반환
};


// ============================================
// 🎯 사용 예시 (프론트엔드 개발자용 가이드)
// ============================================

/*
// React 컴포넌트에서 사용 예시:

// 1. 사용자 등록
const handleRegister = async () => {
  try {
    const user = await registerUser("홍길동");
    console.log("등록된 사용자:", user); // { id: 1, name: "홍길동" }
    
    // AuthContext에 로그인 처리
    login(user);
  } catch (error) {
    console.error("사용자 등록 실패:", error);
  }
};

// 2. 사용자별 프로젝트 목록 조회
const fetchUserProjects = async (userId: number) => {
  try {
    const projects = await getUserProjects(userId);
    console.log("사용자 프로젝트 목록:", projects);
    setProjects(projects);
  } catch (error) {
    console.error("프로젝트 목록 조회 실패:", error);
  }
};

// 3. 사용자별 지원서 목록 조회  
const fetchUserApplications = async (userId: number) => {
  try {
    const applications = await getUserApplications(userId);
    console.log("사용자 지원서 목록:", applications);
    setApplications(applications);
  } catch (error) {
    console.error("지원서 목록 조회 실패:", error);
  }
};

// 4. 사용자 정보 수정 (미구현)
const handleUpdateUser = async (userId: number) => {
  try {
    // const updatedUser = await updateUser(userId, { name: "새이름" });
    // console.log("수정된 사용자:", updatedUser);
  } catch (error) {
    console.error("사용자 정보 수정 실패:", error);
  }
};
*/
