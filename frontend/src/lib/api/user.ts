// 👤 USER API - 백엔드 UserController 연동  
// 사용자 관련 API 함수들 (등록, 조회, 프로젝트/지원서 목록)

import axios from 'axios';

// 환경변수 (.env 파일의 NEXT_PUBLIC_API_URL 사용)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ============================================
// 📝 백엔드 DTO 기반 타입 정의 (실제 Java 코드와 동일)
// ============================================

// 백엔드 DTO 타입들은 types/index.ts에서 가져옴
import { 
  UserRegisterDto, 
  ProjectDetailResponse, 
  ApplicationEntity,
  ApiResponse
} from '@/types';

// 호환성을 위해 Application 타입 재정의
export type Application = ApplicationEntity;

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
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register`, name, {
      headers: {
        'Content-Type': 'application/json' // 백엔드 @RequestBody String 처리용
      }
    });
    return response.data.data; // ApiResponse<UserRegisterDto>에서 data 추출
  } catch (error) {
    console.error('사용자 등록 실패:', error);
    throw error;
  }
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
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/projects`);
    return response.data; // List<ProjectDetailResponse> 직접 반환
  } catch (error) {
    console.error('사용자별 프로젝트 목록 조회 실패:', error);
    throw error;
  }
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
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/applications`);
    return response.data; // List<Application> 직접 반환
  } catch (error) {
    console.error('사용자별 지원서 목록 조회 실패:', error);
    throw error;
  }
};
