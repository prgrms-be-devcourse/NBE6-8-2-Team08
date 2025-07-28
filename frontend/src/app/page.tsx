"use client";

// ============================================
// 📦 React 및 Next.js 기본 모듈
// ============================================
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// ============================================
// 🔗 백엔드 API 연동 모듈 (우리가 만든 api/* 파일들)
// ============================================
import { getAllProjects, ProjectDetailResponse } from '@/lib/api/project';
import { getUserProjects, getUserApplications, Application } from '@/lib/api/user';

// ============================================
// 🔐 인증 컨텍스트 (로그인 상태 관리)
// ============================================
import { useAuth } from '@/contexts/AuthContext';

// ============================================
// 🎨 UI 컴포넌트들
// ============================================
import ProjectCard from '@/components/ui/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// ============================================
// 🎯 아이콘들 (Lucide React)
// ============================================
import { 
  Search, 
  Plus, 
  Filter, 
  Users, 
  Clock, 
  Briefcase,
  Award,
  Activity,
  LogIn,
  LogOut,
  UserPlus
} from 'lucide-react';

// ============================================
// 📊 타입 정의 (백엔드와 100% 동기화된 타입들)
// ============================================

// ✅ ProjectDetailResponse는 api/project.ts에서 import (백엔드 동기화됨)
// ✅ Application은 api/user.ts에서 import (백엔드 동기화됨)

/**
 * 👤 사용자 대시보드 표시용 데이터 구조
 * 
 * 📡 백엔드 API 연동:
 * - totalProjects: GET /users/{id}/projects 응답 개수
 * - totalApplications: GET /users/{id}/applications 응답 개수  
 * - approvedApplications: Application.status === 'APPROVED' 개수
 * - pendingApplications: Application.status === 'PENDING' 개수
 */
interface UserDashboard {
  totalProjects: number;       // 내가 만든 프로젝트 총 개수
  totalApplications: number;   // 내가 지원한 지원서 총 개수
  approvedApplications: number; // 승인된 지원서 개수
  pendingApplications: number;  // 대기중인 지원서 개수
}

/**
 * 🔐 로그인 상태 관리
 * 
 * ✅ AuthContext 사용 - contexts/AuthContext.tsx에서 중앙 관리
 * 📡 백엔드 세션 기반 인증과 연동 (향후 업그레이드 예정)
 */

export default function Home() {
  const router = useRouter();
  
  // ============================================
  // 🔄 상태 관리 (백엔드와 연동된 데이터들)
  // ============================================
  
  // 🔐 AuthContext에서 로그인 상태 관리
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // 📊 프로젝트 목록 상태 (백엔드: ProjectController.getAll())
  const [projects, setProjects] = useState<ProjectDetailResponse[]>([
    {
      id: 999,
      title: "더미 프로젝트",
      description: "메인 페이지에 표시되는 더미 프로젝트입니다.",
      techStacks: ["React", "TypeScript", "TailwindCSS"],
      teamSize: 5,
      currentTeamSize: 2,
      creator: "관리자",
      status: "RECRUITING",
      content: "이 프로젝트는 메인 페이지에 표시되는 더미 데이터입니다.",
      createdAt: new Date().toISOString(),
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  
  // 👤 사용자 대시보드 상태 (백엔드: UserController 연동)
  const [userDashboard, setUserDashboard] = useState<UserDashboard | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // ============================================
  // 🔗 API 호출 함수들 (백엔드 컴트롤러와 1:1 대응)
  // ============================================

  /**
   * 📊 프로젝트 목록 가져오기
   * 
   * 📡 백엔드 API: GET /projects
   * 🏠 컴트롤러: ProjectController.getAll()
   * 📦 응답: ResponseEntity<ApiResponse<List<ProjectDetailResponse>>>
   * 🗂 파일: api/project.ts > getAllProjects() 함수 사용
   */
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        // 🔗 api/project.ts에서 import한 getAllProjects() 호출
        const projectData = await getAllProjects();
        setProjects(projectData);
        
        console.log('✅ 프로젝트 목록 로드 성공:', projectData.length, '개');
      } catch (error) {
        console.error('❌ 프로젝트 목록 조회 실패:', error);
        
        // 🎯 에러 상세 정보 로깅 (개발자용)
        if (error instanceof Error) {
          console.error('에러 메시지:', error.message);
        }
        if (axios.isAxiosError(error)) {
          console.error('API 응답 상태:', error.response?.status);
          console.error('API 응답 데이터:', error.response?.data);
        }
        
        setError('프로젝트 목록을 불러올 수 없습니다. 서버 연결을 확인해주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  /**
   * 👤 사용자 대시보드 데이터 가져오기 (로그인시만 실행)
   * 
   * 📡 백엔드 API 2개 조합:
   * 1. GET /users/{id}/projects -> 내가 만든 프로젝트 목록
   * 2. GET /users/{id}/applications -> 내가 지원한 지원서 목록
   * 
   * 🏠 컴트롤러: UserController.findProjectsById(), findApplicationsById()
   * 🗂 파일: api/user.ts > getUserProjects(), getUserApplications() 함수 사용
   */
  useEffect(() => {
    // 로그인하지 않은 상태면 대시보드 데이터 로드하지 않음
    if (!isAuthenticated || !user?.id) {
      setUserLoading(false);
      return;
    }

    const fetchUserDashboard = async () => {
      setUserLoading(true);
      try {
        // 🔗 api/user.ts에서 import한 함수들 사용
        // 📡 동시 호출로 성능 최적화
        const [userProjects, userApplications] = await Promise.all([
          getUserProjects(user.id),
          getUserApplications(user.id)
        ]);
        
        // 📊 대시보드 데이터 계산
        const dashboard: UserDashboard = {
          totalProjects: userProjects.length,
          totalApplications: userApplications.length,
          approvedApplications: userApplications.filter(app => app.status === 'APPROVED').length,
          pendingApplications: userApplications.filter(app => app.status === 'PENDING').length
        };
        
        setUserDashboard(dashboard);
        console.log('✅ 사용자 대시보드 로드 성공:', dashboard);
        
      } catch (error) {
        console.error('❌ 사용자 대시보드 조회 실패:', error);
        
        // 🎯 에러 상세 정보 로깅 (개발자용)
        if (error instanceof Error) {
          console.error('에러 메시지:', error.message);
        }
        if (axios.isAxiosError(error)) {
          console.error('API 응답 상태:', error.response?.status);
          console.error('API 응답 데이터:', error.response?.data);
        }
        
        // 에러 시 기본값 설정 (사용자 경험 향상)
        setUserDashboard({
          totalProjects: 0,
          totalApplications: 0,
          approvedApplications: 0,
          pendingApplications: 0
        });
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserDashboard();
  }, [isAuthenticated, user?.id]); // 로그인 상태 변경시 재실행

  /**
   * 🔑 로그인/로그아웃 처리 함수들
   * 
   * 📡 백엔드 OAuth: 구글 로그인 연동
   * 🔗 URL: http://localhost:8080/oauth2/authorization/google
   * ✅ AuthContext의 login/logout 함수 활용
   */
  const handleGoogleLogin = () => {
    const redirectUrl = encodeURIComponent(window.location.href);
    const oauthUrl = `http://localhost:8080/oauth2/authorization/google?redirectUrl=${redirectUrl}`;
    
    console.log('🔗 구글 OAuth 로그인 시도:', oauthUrl);
    window.location.href = oauthUrl;
  };
  
  const handleLogout = () => {
    // AuthContext의 logout 함수 사용
    logout();
    
    // 대시보드 데이터 초기화
    setUserDashboard(null);
    
    console.log('✅ 로그아웃 완료');
  };
  
  const handleSignUp = () => {
    // 회원가입도 구글 OAuth로 진행 (동일한 플로우)
    handleGoogleLogin();
  };

  /**
   * 🔍 검색 및 필터링 로직
   * 
   * 📝 기능:
   * - 제목, 설명, 기술스택에서 검색
   * - 프로젝트 상태별 필터링 (RECRUITING, IN_PROGRESS, COMPLETED)
   * 🖥 데이터: 백엔드에서 가져온 projects 배열을 클라이언트에서 필터링
   */
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.techStacks.some((tech: string) => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'ALL' || project.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  /**
   * 💆 프로젝트 카드 클릭 이벤트
   * 
   * 📡 동작: /projects/[id] 페이지로 이동
   * 🗂 해당 페이지에서는 api/project.ts > getProject(id) 사용 예정
   */
  const handleProjectClick = (projectId: number) => {
    console.log('💆 프로젝트 상세 페이지 이동:', projectId);
    router.push(`/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b-2 border-black sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 로고 */}
            <div className="flex items-center space-x-3">
<h1 className="text-2xl font-black text-primary">
                DevMatch
              </h1>
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                Beta
              </span>
            </div>

            {/* 우측 네비게이션 */}
            <nav className="flex items-center gap-3">
              {/* ============================================ */}
              {/* 🔐 로그인 상태별 버튼 렌더링 */}
              {/* ============================================ */}
              
              {!isAuthenticated ? (
                // 비로그인 상태: 로그인 + 회원가입 버튼
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleSignUp}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    회원가입
                  </Button>
                  
                  <Button onClick={handleGoogleLogin}>
                    <LogIn className="mr-2 h-4 w-4" />
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 13.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V6.07H2.18C1.43 7.55 1 9.22 1 11s.43 3.45 1.18 4.93l2.85-2.22.81-.61z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    구글 로그인
                  </Button>
                </div>
              ) : (
                // 로그인 상태: 사용자명 + 로그아웃 버튼
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    안녕하세요, {user?.name || '사용자'}님!
                  </span>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 히어로 섹션 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            🚀 개발 프로젝트를 찾아보세요
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            다양한 기술 스택과 팀원들과 함께할 프로젝트를 발견하고 참여해보세요.<br />
            프로젝트를 통해 실력을 키우고 포트폴리오를 만들어가세요!
          </p>
          
          {/* 주요 기능 소개 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-lg bg-muted/50 neo-card hover:shadow-brutal-lg transition-all duration-200">
              <div className="text-2xl mb-3">👥</div>
              <h3 className="font-black mb-2">팀 매칭</h3>
              <p className="text-sm text-muted-foreground">
                기술 스택과 관심사가 맞는 팀원들과 함께
              </p>
            </div>
            <div className="p-6 rounded-lg bg-muted/50 neo-card hover:shadow-brutal-lg transition-all duration-200">
              <div className="text-2xl mb-3">🎯</div>
              <h3 className="font-black mb-2">프로젝트 추천</h3>
              <p className="text-sm text-muted-foreground">
                AI가 분석한 맞춤형 프로젝트 추천
              </p>
            </div>
            <div className="p-6 rounded-lg bg-muted/50 neo-card hover:shadow-brutal-lg transition-all duration-200">
              <div className="text-2xl mb-3">💼</div>
              <h3 className="font-black mb-2">포트폴리오</h3>
              <p className="text-sm text-muted-foreground">
                실무 경험으로 포트폴리오 완성
              </p>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* 👤 사용자 대시보드 섹션 (로그인시만 표시) */}
        {/* ============================================ */}
        {isAuthenticated && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                내 대시보드
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userLoading ? (
                // 대시보드 로딩 스켈레톤
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-8 w-8 mt-2" />
                        <Skeleton className="h-3 w-20 mt-1" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : userDashboard ? (
                // 대시보드 데이터 표시
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* 내가 만든 프로젝트 */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-black">내 프로젝트</span>
                      </div>
                      <div className="text-2xl font-black mt-2">{userDashboard.totalProjects}</div>
                      <p className="text-xs text-muted-foreground mt-1">만든 프로젝트 수</p>
                    </CardContent>
                  </Card>
                  
                  {/* 지원한 지원서 */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-black">지원서</span>
                      </div>
                      <div className="text-2xl font-black mt-2">{userDashboard.totalApplications}</div>
                      <p className="text-xs text-muted-foreground mt-1">지원한 총 개수</p>
                    </CardContent>
                  </Card>
                  
                  {/* 승인된 지원서 */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-black">승인</span>
                      </div>
                      <div className="text-2xl font-black mt-2">{userDashboard.approvedApplications}</div>
                      <p className="text-xs text-muted-foreground mt-1">승인된 지원서</p>
                    </CardContent>
                  </Card>
                  
                  {/* 대기중인 지원서 */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-black">대기중</span>
                      </div>
                      <div className="text-2xl font-black mt-2">{userDashboard.pendingApplications}</div>
                      <p className="text-xs text-muted-foreground mt-1">대기중인 지원서</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                // 대시보드 데이터 로드 실패 또는 에러 상태
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <div className="text-red-500 text-2xl">⚠️</div>
                  </div>
                  <h4 className="font-black mb-2 text-red-600">대시보드 로드 실패</h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    사용자 데이터를 불러올 수 없습니다.<br/>
                    네트워크 연결이나 서버 상태를 확인해주세요.
                  </p>
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => window.location.reload()}
                  >
                    다시 시도
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* 검색 및 필터 */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* 검색바 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="프로젝트 제목, 설명, 기술스택으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* 상태 필터 */}
              <div className="sm:w-48">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full h-12 px-3 py-2 text-sm bg-background border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-brutal-sm"
                >
                  <option value="ALL">전체 상태</option>
                  <option value="RECRUITING">모집중</option>
                  <option value="IN_PROGRESS">진행중</option>
                  <option value="COMPLETED">완료</option>
                </select>
              </div>

              {/* 프로젝트 생성 버튼 */}
              <Button asChild>
                <Link href="/projects/create">
                  <Plus className="mr-2 h-4 w-4" />
                  프로젝트 생성
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ============================================ */}
        {/* 📊 프로젝트 목록 섹션 */}
        {/* ============================================ */}
        {error ? (
          // 에러 상태
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <div className="text-red-500 text-4xl">⚠️</div>
            </div>
            <h3 className="text-xl font-black mb-2 text-red-600">서버 연결 실패</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="destructive"
            >
              다시 시도
            </Button>
          </div>
        ) : loading ? (
          // 로딩 스켈레톤
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between mb-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="flex gap-1.5 mb-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-14" />
                  </div>
                </CardContent>
                <div className="px-6 pb-6">
                  <div className="pt-4 border-t-2 border-black">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          // 검색 결과 없음 또는 데이터 없음
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-black mb-2">
              {projects.length === 0 ? '등록된 프로젝트가 없습니다' : '검색 결과가 없습니다'}
            </h3>
            <p className="text-muted-foreground">
              {projects.length === 0 ? '첫 번째 프로젝트를 만들어보세요!' : '다른 검색어나 필터를 시도해보세요.'}
            </p>
          </div>
        ) : (
          // 프로젝트 카드 그리드
          <>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <span className="font-black">
                  총 {filteredProjects.length}개의 프로젝트
                </span>
              </div>
              <Button variant="ghost" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                필터
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleProjectClick(project.id)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* ============================================ */}
      {/* 🦶 푸터 섹션 (프로젝트 정보 및 API 연결 상태) */}
      {/* ============================================ */}
      <footer className="border-t-2 border-black mt-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h3 className="text-lg font-black">DevMatch</h3>
              <Badge variant="outline" className="text-xs">
                Frontend-Backend 연동 완료
              </Badge>
            </div>
            
            <p className="text-muted-foreground text-sm mb-6">
              © 2025 DevMatch. 부트캠프 프로젝트 매칭 플랫폼
            </p>
            
            {/* 📡 API 연결 상태 표시 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-50 border-2 border-black neo-card hover:shadow-brutal transition-all duration-200">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700 font-black">프로젝트 API</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-50 border-2 border-black neo-card hover:shadow-brutal transition-all duration-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-700 font-black">사용자 API</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-purple-50 border-2 border-black neo-card hover:shadow-brutal transition-all duration-200">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-purple-700 font-black">지원서 API</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>Made with 💙 by Team08</span>
              <span>•</span>
              <span>Spring Boot + React + TypeScript</span>
              <span>•</span>
              <span>
                API 베이스: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
