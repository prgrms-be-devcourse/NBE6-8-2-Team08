// 🔗 API 통합 export
export { projectApi } from './project';
export { userApi } from './user';
export { authApi } from './auth';
export { applicationApi } from './application';
export { analysisApi } from './analysis';

// 🔧 UTILITY FUNCTIONS
// 에러 처리 유틸리티
export const handleApiError = (error: any) => {
  console.error('API 에러:', error);
  
  // 백엔드 GlobalExceptionHandler에서 반환하는 에러 형식에 맞춰 처리
  if (error.response?.data?.message) {
    return error.response.data.message;
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