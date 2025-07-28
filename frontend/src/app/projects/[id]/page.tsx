"use client";

// ============================================
// 📦 React 및 Next.js 기본 모듈
// ============================================
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// ============================================
// 🔗 백엔드 API 연동 모듈 (우리가 만든 api/* 파일들)
// ============================================
import { getProject, applyToProject, ProjectDetailResponse } from '@/lib/api/project';

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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================
// 🎯 아이콘들 (Lucide React)
// ============================================
import { 
  ArrowLeft, 
  Users, 
  Code2, 
  Loader2, 
  Calendar, 
  User,
  Target,
  Star,
  Briefcase,
  Clock,
  ChevronRight
} from 'lucide-react';

/**
 * 🎯 프로젝트 상세 페이지
 * 
 * 📡 백엔드 API 연동:
 * - GET /projects/{id} - 프로젝트 상세 정보 (✅ 구현완료)
 * - POST /projects/{id}/applications - 프로젝트 지원 (❌ 백엔드 구현 필요)
 * 
 * 🔗 사용하는 API 함수들:
 * - getProject(id): ProjectDetailResponse 반환
 * - applyToProject(projectId, data): 기술스택별 점수와 함께 지원
 * 
 * 🎨 UI 기능:
 * - 프로젝트 정보 표시
 * - 기술스택별 1-10점 점수 입력
 * - 지원하기 버튼
 */
export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  // ============================================
  // 🔄 상태 관리 (백엔드와 연동된 데이터들)
  // ============================================
  
  // 🔐 AuthContext에서 로그인 상태 관리
  const { user, isAuthenticated } = useAuth();
  
  // 📊 프로젝트 상세 정보 상태 (백엔드: ProjectController.get())
  const [project, setProject] = useState<ProjectDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 🎯 지원하기 관련 상태
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [techStackScores, setTechStackScores] = useState<{[key: string]: number}>({});

  // ============================================
  // 🔗 API 호출 함수들 (백엔드 컨트롤러와 1:1 대응)
  // ============================================

  /**
   * 📊 프로젝트 상세 정보 가져오기
   * 
   * 📡 백엔드 API: GET /projects/{id}
   * 🏠 컴트롤러: ProjectController.get(@PathVariable Long id)
   * 📦 응답: ResponseEntity<ApiResponse<ProjectDetailResponse>>
   * 🗂 파일: api/project.ts > getProject() 함수 사용
   */
  useEffect(() => {
    const fetchProject = async () => {
      if (!params.id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const projectId = Number(params.id);
        
        // 🔗 api/project.ts에서 import한 getProject() 호출
        const projectData = await getProject(projectId);
        setProject(projectData);
        
        // 기술스택 점수 초기화 (모든 기술스택을 5점으로 초기설정)
        const initialScores: {[key: string]: number} = {};
        projectData.techStacks.forEach(tech => {
          initialScores[tech] = 5; // 기본값 5점
        });
        setTechStackScores(initialScores);
        
        console.log('✅ 프로젝트 상세 정보 로드 성공:', projectData);
        
      } catch (error) {
        console.error('❌ 프로젝트 상세 조회 실패:', error);
        
        // 🎯 에러 상세 정보 로깅 (개발자용)
        if (error instanceof Error) {
          console.error('에러 메시지:', error.message);
          setError(error.message);
        } else {
          setError('프로젝트 정보를 불러올 수 없습니다. 서버 연결을 확인해주세요.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  /**
   * 🎯 프로젝트 지원하기 처리
   * 
   * 📡 백엔드 API: POST /projects/{id}/applications
   * 🏠 컴트롤러: ProjectController.apply(@PathVariable Long id, @RequestBody ProjectApplyRequest)
   * 📦 요청: { userId: number, techStacks: string[], techScores: number[] }
   * 🗂 파일: api/project.ts > applyToProject() 함수 사용
   */
  const handleApply = async () => {
    if (!project || !user?.id) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 모든 기술스택 점수가 1-10 범위인지 확인
    const scores = Object.values(techStackScores);
    const hasInvalidScore = scores.some(score => score < 1 || score > 10);
    
    if (hasInvalidScore) {
      alert('모든 기술스택 점수는 1~10점 사이여야 합니다.');
      return;
    }

    setApplying(true);
    
    try {
      // 🔗 api/project.ts에서 import한 applyToProject() 호출
      const applicationData = {
        userId: user.id,
        techStacks: project.techStacks,  // 프로젝트의 기술스택 목록
        techScores: project.techStacks.map(tech => techStackScores[tech]) // 각 기술스택별 점수
      };
      
      await applyToProject(project.id, applicationData);
      
      alert('지원이 완료되었습니다!');
      setShowApplicationModal(false);
      
      console.log('✅ 프로젝트 지원 성공:', applicationData);
      
    } catch (error) {
      console.error('❌ 프로젝트 지원 실패:', error);
      
      // 🎯 에러 상세 정보 로깅 (개발자용)
      if (error instanceof Error) {
        console.error('에러 메시지:', error.message);
        
        // 백엔드 미구현 에러일 경우 사용자에게 안내
        if (error.message.includes('백엔드 구현 대기중')) {
          alert('🚧 지원 기능은 백엔드 구현 완료 후 사용 가능합니다.\n현재는 UI만 확인하실 수 있습니다.');
        } else {
          alert('지원 중 오류가 발생했습니다: ' + error.message);
        }
      } else {
        alert('지원 중 오류가 발생했습니다.');
      }
    } finally {
      setApplying(false);
    }
  };

  /**
   * 🎯 기술스택 점수 변경 핸들러
   * 
   * 📝 기능: 특정 기술스택의 점수를 1-10점 범위에서 변경
   * 🎨 UI: Input number 타입으로 점수 입력
   */
  const handleScoreChange = (techStack: string, score: number) => {
    // 1-10 범위로 제한
    const validScore = Math.max(1, Math.min(10, score));
    setTechStackScores(prev => ({
      ...prev,
      [techStack]: validScore
    }));
  };

  // ============================================
  // 🎨 UI 렌더링
  // ============================================

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="프로젝트 정보 로딩 중">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-primary" aria-hidden="true" />
          <p className="text-muted-foreground">프로젝트 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="alert" aria-live="assertive">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <div className="text-red-500 text-4xl">⚠️</div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-red-600" id="error-title">
            {error ? '프로젝트 로드 실패' : '프로젝트를 찾을 수 없습니다'}
          </h2>
          <p className="text-muted-foreground mb-6" id="error-description">
            {error || '잘못된 프로젝트 ID이거나 삭제된 프로젝트입니다.'}
          </p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              메인으로 돌아가기
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <header className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" asChild>
              <Link href="/" aria-label="프로젝트 목록으로 돌아가기">
                <ArrowLeft className="mr-2 h-4 w-4" />
                프로젝트 목록
              </Link>
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                프로젝트 ID: {project.id}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ============================================ */}
          {/* 📊 왼쪽: 프로젝트 상세 정보 */}
          {/* ============================================ */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 프로젝트 헤더 */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-3xl">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(project.createdAt).toLocaleDateString('ko-KR')} 생성
                    </CardDescription>
                    <CardDescription className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      프로젝트 리더: {project.creator}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={project.status === 'RECRUITING' ? 'default' : 
                            project.status === 'IN_PROGRESS' ? 'secondary' : 'outline'}
                    className={project.status === 'RECRUITING' ? 
                              'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400' : ''}
                  >
                    {project.status === 'RECRUITING' ? '🟢 모집중' : 
                     project.status === 'IN_PROGRESS' ? '🟡 진행중' : '🔴 완료'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 프로젝트 설명 */}
                <div>
                  <h4 className="font-semibold mb-2">프로젝트 소개</h4>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                </div>

                {/* 상세 내용 */}
                {project.content && (
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-lg">📋 프로젝트 상세 내용</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-wrap text-sm">
                        {project.content}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* 기술 스택 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  기술 스택 ({project.techStacks.length}개)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {project.techStacks.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 팀 구성 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  팀 구성 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold text-blue-600">{project.teamSize}</div>
                      <p className="text-sm text-muted-foreground">목표 팀 사이즈</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold text-green-600">{project.currentTeamSize}</div>
                      <p className="text-sm text-muted-foreground">현재 팀원 수</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ============================================ */}
          {/* 🎯 오른쪽: 지원하기 사이드바 */}
          {/* ============================================ */}
          <div className="space-y-6">
            
            {/* 프로젝트 현황 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  프로젝트 현황
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">모집 상태</span>
                  <Badge variant={project.status === 'RECRUITING' ? 'default' : 'secondary'}>
                    {project.status === 'RECRUITING' ? '모집중' : '모집완료'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">팀 구성률</span>
                  <span className="font-semibold">
                    {Math.round((project.currentTeamSize / project.teamSize) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((project.currentTeamSize / project.teamSize) * 100, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* 지원하기 버튼 */}
            {project.status === 'RECRUITING' && (
              <Card>
                <CardContent className="p-6">
                  {!isAuthenticated ? (
                    <div className="text-center space-y-3">
                      <p className="text-sm text-muted-foreground">
                        프로젝트에 지원하려면 로그인이 필요합니다
                      </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/" aria-label="로그인 페이지로 이동">
                      로그인하러 가기
                    </Link>
                  </Button>
                    </div>
                  ) : (
            <Button
              onClick={() => setShowApplicationModal(true)}
              className="w-full"
              size="lg"
              aria-haspopup="dialog"
              aria-expanded={showApplicationModal}
            >
              <Target className="mr-2 h-4 w-4" />
              프로젝트 지원하기
            </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 지원 가이드 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  지원 가이드
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium">기술스택 점수 입력</p>
                    <p className="text-xs text-muted-foreground">각 기술스택에 대한 본인의 실력을 1-10점으로 평가</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-600">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium">지원서 제출</p>
                    <p className="text-xs text-muted-foreground">점수를 입력하고 지원 버튼을 클릭</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium">결과 대기</p>
                    <p className="text-xs text-muted-foreground">프로젝트 리더의 승인을 기다립니다</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* ============================================ */}
      {/* 🎯 지원하기 모달 (기술스택별 점수 입력) */}
      {/* ============================================ */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="application-modal-title">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" id="application-modal-title">
                <Target className="h-5 w-5" />
                {project.title} 프로젝트 지원하기
              </CardTitle>
              <CardDescription>
                각 기술스택에 대한 본인의 실력을 1-10점으로 평가해주세요. (5점이 기본값입니다)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* 기술스택별 점수 입력 */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">기술스택별 실력 평가</Label>
                <div className="space-y-4">
                  {project.techStacks.map((tech, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{tech}</Badge>
                          <span className="text-sm text-muted-foreground">
                            실력 점수
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={techStackScores[tech] || 5}
                            onChange={(e) => handleScoreChange(tech, parseInt(e.target.value) || 1)}
                            className="w-20 text-center"
                          />
                          <span className="text-sm text-muted-foreground">/ 10점</span>
                        </div>
                      </div>
                      
                      {/* 점수 설명 */}
                      <div className="mt-2 text-xs text-muted-foreground">
                        {techStackScores[tech] <= 3 && "기초 수준 - 학습이 필요합니다"}
                        {techStackScores[tech] >= 4 && techStackScores[tech] <= 6 && "중급 수준 - 기본적인 개발이 가능합니다"}
                        {techStackScores[tech] >= 7 && techStackScores[tech] <= 8 && "고급 수준 - 숙련된 개발이 가능합니다"}
                        {techStackScores[tech] >= 9 && "전문가 수준 - 다른 사람을 가르칠 수 있습니다"}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* 평균 점수 표시 */}
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">평균 실력 점수</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {(Object.values(techStackScores).reduce((a, b) => a + b, 0) / Object.values(techStackScores).length).toFixed(1)}
                      </span>
                      <span className="text-sm text-muted-foreground">/ 10점</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 버튼 영역 */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowApplicationModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  onClick={handleApply}
                  disabled={applying}
                  className="flex-1"
                >
                  {applying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      지원 중...
                    </>
                  ) : (
                    <>
                      <Target className="mr-2 h-4 w-4" />
                      지원하기
                    </>
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
