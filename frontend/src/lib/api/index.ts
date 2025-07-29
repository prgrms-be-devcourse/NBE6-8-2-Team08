// 🔗 API 통합 export
// 각 도메인별 API 함수들을 개별적으로 export하여 사용

// 프로젝트 관련 API
export {
  createProject,
  getAllProjects,
  getProject,
  updateProjectStatus,
  updateProjectContent,
  deleteProject,
  getProjectApplications,
  applyToProject
} from './project';

// 사용자 관련 API
export {
  registerUser,
  getUserProjects,
  getUserApplications
} from './user';

// 인증 관련 API
export { authApi } from './auth';

// 지원서 관련 API
export {
  getApplicationDetail,
  deleteApplication,
  updateApplicationStatus,
  createApplication
} from './application';

// 분석 관련 API
export {
  getAnalysisResult,
  createAnalysisResult,
  createTeamRoleAssignment
} from './analysis';

// 🔧 UTILITY FUNCTIONS
// 에러 처리 유틸리티
export const handleApiError = (error: unknown) => {
  console.error('API 에러:', error);
  
  // 백엔드 GlobalExceptionHandler에서 반환하는 에러 형식에 맞춰 처리
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const apiError = error as { response?: { data?: { message?: string } } };
    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }
  }
  
  return '서버 오류가 발생했습니다.';
};

// API 연결 상태 확인
export const checkApiConnection = async (): Promise<boolean> => {
  try {
    // const response = await fetch('/api/health'); // 헬스체크 엔드포인트 필요
    // return response.status === 200;
    return false; // 현재는 연결 안됨
  } catch {
    return false;
  }
};
