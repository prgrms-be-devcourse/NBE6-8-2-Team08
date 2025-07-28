"use client";

// ============================================
// 📦 React 및 Next.js 기본 모듈
// ============================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ============================================
// 🔗 백엔드 API 연동 모듈 (우리가 만든 api/* 파일들)
// ============================================
import { 
  updateProjectStatus, 
  updateProjectContent, 
  deleteProject, 
  getProjectApplications,
  ProjectDetailResponse 
} from '@/lib/api/project';
import { getUserProjects } from '@/lib/api/user';

// ============================================
// 🔐 인증 컨텍스트 (로그인 상태 관리)
// ============================================
import { useAuth } from '@/contexts/AuthContext';

// ============================================
// 🎨 UI 컴포넌트들
// ============================================
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

// ============================================
// 🎯 아이콘들 (Lucide React)
// ============================================
import { 
  ArrowLeft,
  Settings,
  Edit3,
  Trash2,
  Users,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Calendar,
  Code2,
  Target,
  Activity,
  Briefcase,
  Award,
  Loader2,
  X
} from 'lucide-react';

/**
 * 🎯 내 프로젝트 관리 페이지
 * 
 * 📡 백엔드 API 연동:
 * - GET /users/{id}/projects - 내 프로젝트 목록 (✅ 구현완료)
 * - PATCH /projects/{id}/status - 프로젝트 상태 변경 (✅ 구현완료)
 * - PATCH /projects/{id}/content - 프로젝트 내용 수정 (❌ 백엔드 부분구현)
 * - DELETE /projects/{id} - 프로젝트 삭제 (❌ 백엔드 부분구현)
 * - GET /projects/{id}/applications - 프로젝트 지원서 조회 (❌ 백엔드 부분구현)
 * 
 * 🔗 사용하는 API 함수들:
 * - getUserProjects(userId): ProjectDetailResponse[] 반환
 * - updateProjectStatus(projectId, status): ProjectDetailResponse 반환
 * - updateProjectContent(projectId, content): void 반환
 * - deleteProject(projectId): void 반환
 * - getProjectApplications(projectId): any[] 반환
 * 
 * 🎨 UI 기능:
 * - 내 프로젝트 목록 표시
 * - 프로젝트별 통계 및 필터링
 * - 프로젝트 상태 변경 (모달)
 * - 프로젝트 내용 수정 (모달)
 * - 프로젝트 지원서 조회 (모달)
 * - 프로젝트 삭제 (확인 모달)
 */

// ============================================
// 📊 타입 정의
// ============================================

interface ProjectStats {
  total: number;
  recruiting: number;
  inProgress: number;
  completed: number;
}

interface Application {
  id: number;
  userId: number;
  projectId: number;
  status: string;
  appliedAt: string;
}

type ModalType = 'status' | 'content' | 'applications' | 'delete' | null;

export default function MyProjectsPage() {
  const router = useRouter();
  
  // ============================================
  // 🔄 상태 관리 (백엔드와 연동된 데이터들)
  // ============================================
  
  // 🔐 AuthContext에서 로그인 상태 관리
  const { user, isAuthenticated } = useAuth();
  
  // 📊 프로젝트 목록 상태 (백엔드: UserController.findProjectsById())
  const [projects, setProjects] = useState<ProjectDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 🔍 검색 및 필터링 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  
  // 🎯 모달 관리 상태
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectDetailResponse | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  // 📝 폼 데이터 상태
  const [newStatus, setNewStatus] = useState('');
  const [newContent, setNewContent] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);

  // ============================================
  // 🔗 API 호출 함수들 (백엔드 컨트롤러와 1:1 대응)
  // ============================================

  /**
   * 📊 내 프로젝트 목록 가져오기
   * 
   * 📡 백엔드 API: GET /users/{id}/projects
   * 🏠 컨트롤러: UserController.findProjectsById(@PathVariable long id)
   * 📦 응답: List<ProjectDetailResponse> (직접 반환)
   * 🗂 파일: api/user.ts > getUserProjects() 함수 사용
   */
  useEffect(() => {
    // 로그인하지 않은 상태면 프로젝트 로드하지 않음
    if (!isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }

    const fetchMyProjects = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 🔗 api/user.ts에서 import한 getUserProjects() 호출
        const projectData = await getUserProjects(user.id);
        setProjects(projectData);
        
        console.log('✅ 내 프로젝트 목록 로드 성공:', projectData.length, '개');
        
      } catch (error) {
        console.error('❌ 내 프로젝트 목록 조회 실패:', error);
        
        // 🎯 에러 상세 정보 로깅 (개발자용)
        if (error instanceof Error) {
          console.error('에러 메시지:', error.message);
          setError(error.message);
        } else {
          setError('프로젝트 목록을 불러올 수 없습니다. 서버 연결을 확인해주세요.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyProjects();
  }, [isAuthenticated, user?.id]);

  /**
   * 📊 프로젝트 통계 계산
   * 
   * 📝 기능: 상태별 프로젝트 개수 계산
   */
  const calculateStats = (): ProjectStats => {
    return {
      total: projects.length,
      recruiting: projects.filter(p => p.status === 'RECRUITING').length,
      inProgress: projects.filter(p => p.status === 'IN_PROGRESS').length,
      completed: projects.filter(p => p.status === 'COMPLETED').length
    };
  };

  /**
   * 🔍 검색 및 필터링 로직
   * 
   * 📝 기능:
   * - 제목, 설명, 기술스택에서 검색
   * - 프로젝트 상태별 필터링
   */
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.techStacks.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'ALL' || project.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // ============================================
  // 🎯 프로젝트 관리 함수들
  // ============================================

  /**
   * 📝 프로젝트 상태 변경 처리
   * 
   * 📡 백엔드 API: PATCH /projects/{id}/status
   * 🏠 컨트롤러: ProjectController.modifyStatus(@PathVariable Long id, @RequestBody ProjectStatusUpdateRequest)
   * 🗂 파일: api/project.ts > updateProjectStatus() 함수 사용
   */
  const handleStatusUpdate = async () => {
    if (!selectedProject || !newStatus) {
      alert('상태를 선택해주세요.');
      return;
    }
    
    setModalLoading(true);
    
    try {
      // 🔗 api/project.ts에서 import한 updateProjectStatus() 호출
      const updatedProject = await updateProjectStatus(selectedProject.id, newStatus);
      
      // 로컬 상태 업데이트
      setProjects(prev => prev.map(p => 
        p.id === selectedProject.id ? updatedProject : p
      ));
      
      alert('프로젝트 상태가 성공적으로 변경되었습니다!');
      setActiveModal(null);
      setSelectedProject(null);
      setNewStatus('');
      
      console.log('✅ 프로젝트 상태 변경 성공:', updatedProject);
      
    } catch (error) {
      console.error('❌ 프로젝트 상태 변경 실패:', error);
      
      if (error instanceof Error) {
        alert('상태 변경 중 오류가 발생했습니다: ' + error.message);
      } else {
        alert('상태 변경 중 오류가 발생했습니다.');
      }
    } finally {
      setModalLoading(false);
    }
  };

  /**
   * ✏️ 프로젝트 내용 수정 처리
   * 
   * 📡 백엔드 API: PATCH /projects/{id}/content
   * 🏠 컨트롤러: ProjectController.modifyContent() (❌ 부분구현)
   * 🗂 파일: api/project.ts > updateProjectContent() 함수 사용
   */
  const handleContentUpdate = async () => {
    if (!selectedProject || !newContent.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    
    setModalLoading(true);
    
    try {
      // 🔗 api/project.ts에서 import한 updateProjectContent() 호출
      await updateProjectContent(selectedProject.id, newContent.trim());
      
      // 로컬 상태 업데이트 (content 필드 업데이트)
      setProjects(prev => prev.map(p => 
        p.id === selectedProject.id ? { ...p, content: newContent.trim() } : p
      ));
      
      alert('프로젝트 내용이 성공적으로 수정되었습니다!');
      setActiveModal(null);
      setSelectedProject(null);
      setNewContent('');
      
      console.log('✅ 프로젝트 내용 수정 성공');
      
    } catch (error) {
      console.error('❌ 프로젝트 내용 수정 실패:', error);
      
      if (error instanceof Error) {
        console.error('에러 메시지:', error.message);
        
        // 백엔드 미구현 에러일 경우 사용자에게 안내
        if (error.message.includes('백엔드 구현 대기중')) {
          alert('🚧 내용 수정 기능은 백엔드 구현 완료 후 사용 가능합니다.\n현재는 UI만 확인하실 수 있습니다.');
        } else {
          alert('내용 수정 중 오류가 발생했습니다: ' + error.message);
        }
      } else {
        alert('내용 수정 중 오류가 발생했습니다.');
      }
    } finally {
      setModalLoading(false);
    }
  };

  /**
   * 📋 프로젝트 지원서 조회 처리
   * 
   * 📡 백엔드 API: GET /projects/{id}/applications
   * 🏠 컨트롤러: ProjectController.getApplications() (❌ 부분구현)
   * 🗂 파일: api/project.ts > getProjectApplications() 함수 사용
   */
  const handleViewApplications = async (project: ProjectDetailResponse) => {
    setSelectedProject(project);
    setActiveModal('applications');
    setModalLoading(true);
    
    try {
      // 🔗 api/project.ts에서 import한 getProjectApplications() 호출
      const applicationData = await getProjectApplications(project.id);
      setApplications(applicationData);
      
      console.log('✅ 프로젝트 지원서 조회 성공:', applicationData);
      
    } catch (error) {
      console.error('❌ 프로젝트 지원서 조회 실패:', error);
      
      if (error instanceof Error && error.message.includes('백엔드 구현 대기중')) {
        alert('🚧 지원서 조회 기능은 백엔드 구현 완료 후 사용 가능합니다.\n현재는 UI만 확인하실 수 있습니다.');
        // 임시 데이터로 UI 테스트
        setApplications([]);
      } else {
        alert('지원서 조회 중 오류가 발생했습니다.');
        setActiveModal(null);
      }
    } finally {
      setModalLoading(false);
    }
  };

  /**
   * 🗑️ 프로젝트 삭제 처리
   * 
   * 📡 백엔드 API: DELETE /projects/{id}
   * 🏠 컨트롤러: ProjectController.delete() (❌ 부분구현)
   * 🗂 파일: api/project.ts > deleteProject() 함수 사용
   */
  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    
    setModalLoading(true);
    
    try {
      // 🔗 api/project.ts에서 import한 deleteProject() 호출
      await deleteProject(selectedProject.id);
      
      // 로컬 상태에서 프로젝트 제거
      setProjects(prev => prev.filter(p => p.id !== selectedProject.id));
      
      alert('프로젝트가 성공적으로 삭제되었습니다!');
      setActiveModal(null);
      setSelectedProject(null);
      
      console.log('✅ 프로젝트 삭제 성공');
      
    } catch (error) {
      console.error('❌ 프로젝트 삭제 실패:', error);
      
      if (error instanceof Error) {
        console.error('에러 메시지:', error.message);
        
        // 백엔드 미구현 에러일 경우 사용자에게 안내
        if (error.message.includes('백엔드 구현 대기중')) {
          alert('🚧 프로젝트 삭제 기능은 백엔드 구현 완료 후 사용 가능합니다.\n현재는 UI만 확인하실 수 있습니다.');
        } else {
          alert('프로젝트 삭제 중 오류가 발생했습니다: ' + error.message);
        }
      } else {
        alert('프로젝트 삭제 중 오류가 발생했습니다.');
      }
    } finally {
      setModalLoading(false);
    }
  };

  // ============================================
  // 🎯 모달 관리 함수들
  // ============================================

  const openStatusModal = (project: ProjectDetailResponse) => {
    setSelectedProject(project);
    setNewStatus(project.status);
    setActiveModal('status');
  };

  const openContentModal = (project: ProjectDetailResponse) => {
    setSelectedProject(project);
    setNewContent(project.content || '');
    setActiveModal('content');
  };

  const openDeleteModal = (project: ProjectDetailResponse) => {
    setSelectedProject(project);
    setActiveModal('delete');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedProject(null);
    setNewStatus('');
    setNewContent('');
    setApplications([]);
  };

  // 로그인하지 않은 상태라면 로그인 안내
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              로그인이 필요합니다
            </CardTitle>
            <CardDescription>
              내 프로젝트를 관리하려면 먼저 로그인해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">
                메인 페이지로 이동
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-background text-foreground">
      {/* 헤더 */}
      <header className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" asChild className="btn-neon">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                메인으로
              </Link>
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs badge-neon">
                내 프로젝트: {projects.length}개
              </Badge>
              <span className="text-sm text-muted-foreground">
                {user?.name}님
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            내 프로젝트 관리
          </h1>
          <p className="text-muted-foreground">
            만든 프로젝트들을 관리하고 지원서를 확인해보세요.
          </p>
        </div>

        {/* ============================================ */}
        {/* 📊 프로젝트 통계 섹션 */}
        {/* ============================================ */}
        {!loading && projects.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                프로젝트 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* 총 프로젝트 수 */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">총 프로젝트</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">{calculateStats().total}</div>
                    <p className="text-xs text-muted-foreground mt-1">만든 프로젝트 수</p>
                  </CardContent>
                </Card>
                
                {/* 모집중 */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">모집중</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">{calculateStats().recruiting}</div>
                    <p className="text-xs text-muted-foreground mt-1">팀원 모집중</p>
                  </CardContent>
                </Card>
                
                {/* 진행중 */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">진행중</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">{calculateStats().inProgress}</div>
                    <p className="text-xs text-muted-foreground mt-1">개발 진행중</p>
                  </CardContent>
                </Card>
                
                {/* 완료 */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">완료</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">{calculateStats().completed}</div>
                    <p className="text-xs text-muted-foreground mt-1">완료된 프로젝트</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ============================================ */}
        {/* 🔍 검색 및 필터 섹션 */}
        {/* ============================================ */}
        <Card className="mb-8">
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
                  className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="ALL">전체 상태</option>
                  <option value="RECRUITING">모집중</option>
                  <option value="IN_PROGRESS">진행중</option>
                  <option value="COMPLETED">완료</option>
                </select>
              </div>

              {/* 새 프로젝트 생성 버튼 */}
              <Button asChild>
                <Link href="/projects/create">
                  <Plus className="mr-2 h-4 w-4" />
                  새 프로젝트
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ============================================ */}
        {/* 📋 프로젝트 목록 섹션 */}
        {/* ============================================ */}
        {error ? (
          // 에러 상태
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <div className="text-red-500 text-4xl">⚠️</div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-red-600">데이터 로드 실패</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600"
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
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          // 프로젝트 없음
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <Briefcase className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {projects.length === 0 ? '아직 만든 프로젝트가 없습니다' : '검색 결과가 없습니다'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {projects.length === 0 ? '첫 번째 프로젝트를 만들어보세요!' : '다른 검색어나 필터를 시도해보세요.'}
            </p>
            {projects.length === 0 && (
              <Button asChild>
                <Link href="/projects/create">
                  <Plus className="mr-2 h-4 w-4" />
                  프로젝트 만들기
                </Link>
              </Button>
            )}
          </div>
        ) : (
          // 프로젝트 카드 그리드
          <>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  총 {filteredProjects.length}개의 프로젝트
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <Badge 
                        variant={project.status === 'RECRUITING' ? 'default' : 
                                project.status === 'IN_PROGRESS' ? 'secondary' : 'outline'}
                        className={project.status === 'RECRUITING' ? 
                                  'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400' : ''}
                      >
                        {project.status === 'RECRUITING' ? '🟢 모집중' : 
                         project.status === 'IN_PROGRESS' ? '🟡 진행중' : '🔴 완료'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ID: {project.id}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-lg leading-tight">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {/* 기술스택 */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStacks.slice(0, 3).map((tech, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.techStacks.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.techStacks.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* 팀 구성 정보 */}
                    <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">팀 구성률</span>
                        <span className="text-sm font-medium">
                          {project.currentTeamSize}/{project.teamSize}명
                        </span>
                      </div>
                      <Progress 
                        value={(project.currentTeamSize / project.teamSize) * 100}
                        className="h-2"
                      />
                    </div>
                    
                    {/* 관리 버튼들 */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openStatusModal(project)}
                        className="text-xs"
                      >
                        <Settings className="mr-1 h-3 w-3" />
                        상태변경
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openContentModal(project)}
                        className="text-xs"
                      >
                        <Edit3 className="mr-1 h-3 w-3" />
                        내용수정
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplications(project)}
                        className="text-xs"
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        지원서보기
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteModal(project)}
                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        삭제
                      </Button>
                    </div>
                    
                    {/* 프로젝트 상세 보기 */}
                    <div className="mt-3 pt-3 border-t">
                      <Button variant="ghost" size="sm" asChild className="w-full">
                        <Link href={`/projects/${project.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          상세 보기
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>

      {/* ============================================ */}
      {/* 🎯 모달들 */}
      {/* ============================================ */}
      
      {/* 상태 변경 모달 */}
      {activeModal === 'status' && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                프로젝트 상태 변경
              </CardTitle>
              <CardDescription>
                {selectedProject.title}의 상태를 변경합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>새 상태 선택</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="상태를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RECRUITING">🟢 모집중</SelectItem>
                    <SelectItem value="IN_PROGRESS">🟡 진행중</SelectItem>
                    <SelectItem value="COMPLETED">🔴 완료</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={closeModal}
                  variant="outline"
                  className="flex-1"
                  disabled={modalLoading}
                >
                  취소
                </Button>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={modalLoading || !newStatus}
                  className="flex-1"
                >
                  {modalLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      변경 중...
                    </>
                  ) : (
                    '변경하기'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 내용 수정 모달 */}
      {activeModal === 'content' && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                프로젝트 내용 수정
              </CardTitle>
              <CardDescription>
                {selectedProject.title}의 상세 내용을 수정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>프로젝트 상세 내용</Label>
                <Textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="프로젝트의 상세 내용을 입력해주세요..."
                  rows={10}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {newContent.length}/2000자
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={closeModal}
                  variant="outline"
                  className="flex-1"
                  disabled={modalLoading}
                >
                  취소
                </Button>
                <Button
                  onClick={handleContentUpdate}
                  disabled={modalLoading || !newContent.trim()}
                  className="flex-1"
                >
                  {modalLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      수정 중...
                    </>
                  ) : (
                    '수정하기'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 지원서 조회 모달 */}
      {activeModal === 'applications' && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                지원서 목록
              </CardTitle>
              <CardDescription>
                {selectedProject.title}에 지원한 지원서들을 확인하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {modalLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">지원서를 불러오는 중...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h4 className="font-semibold mb-2">아직 지원서가 없습니다</h4>
                  <p className="text-muted-foreground text-sm">
                    프로젝트가 모집중일 때 지원자들의 지원서를 확인할 수 있습니다.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">지원자 #{application.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              지원일: {new Date(application.appliedAt).toLocaleDateString('ko-KR')}
                            </p>
                          </div>
                          <Badge variant={application.status === 'APPROVED' ? 'default' : 'secondary'}>
                            {application.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              <div className="mt-6">
                <Button onClick={closeModal} className="w-full">
                  닫기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {activeModal === 'delete' && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                프로젝트 삭제
              </CardTitle>
              <CardDescription>
                이 작업은 되돌릴 수 없습니다. 정말로 삭제하시겠습니까?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-1">{selectedProject.title}</h4>
                <p className="text-sm text-red-600">
                  프로젝트와 관련된 모든 데이터가 삭제됩니다.
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={closeModal}
                  variant="outline"
                  className="flex-1"
                  disabled={modalLoading}
                >
                  취소
                </Button>
                <Button
                  onClick={handleDeleteProject}
                  disabled={modalLoading}
                  variant="destructive"
                  className="flex-1"
                >
                  {modalLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      삭제 중...
                    </>
                  ) : (
                    '삭제하기'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
