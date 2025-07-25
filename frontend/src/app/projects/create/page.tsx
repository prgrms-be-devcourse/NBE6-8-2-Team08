"use client";

// ============================================
// 📦 React 및 Next.js 기본 모듈
// ============================================
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ============================================
// 🔗 백엔드 API 연동 모듈 (우리가 만든 api/* 파일들)
// ============================================
import { createProject, ProjectDetailResponse } from '@/lib/api/project';

// ============================================
// 🔐 인증 컨텍스트 (로그인 상태 관리)
// ============================================
import { useAuth } from '@/contexts/AuthContext';

// ============================================
// 🎨 UI 컴포넌트들
// ============================================
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ============================================
// 🎯 아이콘들 (Lucide React)
// ============================================
import { 
  ArrowLeft, 
  Loader2, 
  Plus, 
  Minus, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Code2,
  Users,
  Calendar,
  Target,
  AlertCircle
} from 'lucide-react';

/**
 * 🎯 프로젝트 생성 페이지
 * 
 * 📡 백엔드 API 연동:
 * - POST /projects - 프로젝트 생성 (✅ 구현완료)
 * - 요청: ProjectCreateRequest { userId, title, description, techStacks, teamSize, durationWeeks }
 * - 응답: ResponseEntity<ApiResponse<ProjectDetailResponse>>
 * 
 * 🔗 사용하는 API 함수들:
 * - createProject(data): ProjectDetailResponse 반환
 * 
 * 🎨 UI 기능:
 * - 기술스택 동적 추가/제거 (태그 형태)
 * - 데이터 무결성 보장 (중복 방지, 빈값 방지)
 * - AuthContext 로그인 상태 연동
 * - 기술스택 배열을 직접 백엔드로 전송
 */
export default function CreateProjectPage() {
  const router = useRouter();
  
  // ============================================
  // 🔄 상태 관리 (백엔드와 연동된 데이터들)
  // ============================================
  
  // 🔐 AuthContext에서 로그인 상태 관리
  const { user, isAuthenticated } = useAuth();
  
  // 📊 폼 상태 관리
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 🎯 기술스택 입력 상태
  const [techStackInput, setTechStackInput] = useState('');
  
  // 📝 폼 데이터 (백엔드 ProjectCreateRequest와 1:1 대응)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStacks: [] as string[], // 동적 추가/제거, 배열 형태로 백엔드 전송
    teamSize: 1,                // 팀 크기 (최소 1명)
    durationWeeks: 4           // 프로젝트 기간 (기본 4주)
  });

  // ============================================
  // 🔗 API 호출 및 데이터 처리 함수들
  // ============================================
  
  /**
   * 🎯 기술스택 추가 함수
   * 
   * 📝 기능:
   * - 빈 문자열 방지
   * - 중복 방지
   * - 백엔드 정규식과 일치하는 문자만 허용 (A-Za-z0-9_.+#-)
   * - 길이 제한 (1-30자)
   * - 전체 기술스택 개수 제한 (10개)
   * - 트림 처리
   */
  const addTechStack = () => {
    const tech = techStackInput.trim();
    
    // 유효성 검사
    if (!tech) {
      alert('기술스택명을 입력해주세요.');
      return;
    }
    
    // 길이 검증
    if (tech.length > 30) {
      alert('기술스택명은 30자 이하로 입력해주세요.');
      return;
    }
    
    // 백엔드 정규식과 일치하는 문자만 허용 (A-Za-z0-9_.+#-)
    if (!/^[\w.+#-]+$/.test(tech)) {
      alert('기술스택명은 영문, 숫자, 언더스코어(_), 점(.), 플러스(+), 샵(#), 하이픈(-)만 사용할 수 있습니다.');
      return;
    }
    
    // 전체 기술스택 개수 제한
    if (formData.techStacks.length >= 10) {
      alert('기술스택은 최대 10개까지 추가할 수 있습니다.');
      return;
    }
    
    // 중복 방지 (대소문자 구분하지 않음)
    if (formData.techStacks.some(existingTech => existingTech.toLowerCase() === tech.toLowerCase())) {
      alert('이미 추가된 기술스택입니다.');
      return;
    }
    
    // 기술스택 추가
    setFormData(prev => ({
      ...prev,
      techStacks: [...prev.techStacks, tech]
    }));
    
    // 입력 필드 초기화
    setTechStackInput('');
    
    console.log('✅ 기술스택 추가:', tech);
  };
  
  /**
   * 🗑️ 기술스택 제거 함수
   * 
   * 📝 기능:
   * - 특정 기술스택을 배열에서 제거
   */
  const removeTechStack = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      techStacks: prev.techStacks.filter(tech => tech !== techToRemove)
    }));
    
    console.log('🗑️ 기술스택 제거:', techToRemove);
  };
  
  /**
   * ⌨️ Enter 키 입력 처리
   * 
   * 📝 기능: Enter 키로 기술스택 추가
   */
  const handleTechStackKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechStack();
    }
  };

  /**
   * ✅ 폼 유효성 검사 함수
   * 
   * 📝 검증 항목:
   * - 제목: 1-200자 (백엔드 @Size 제약)
   * - 설명: 1-2000자 (백엔드 @Size 제약)
   * - 기술스택: 최소 1개 이상 필수
   * - 팀 크기: 최소 1명 이상 (백엔드 @Min 제약)
   * - 프로젝트 기간: 최소 1주 이상 (백엔드 @Min 제약)
   * - 로그인 상태: 반드시 로그인된 상태여야 함
   */
  const validateForm = () => {
    const errors: string[] = [];
    
    // 로그인 상태 확인
    if (!isAuthenticated || !user?.id) {
      errors.push('로그인이 필요합니다.');
    }
    
    // 제목 검증
    if (!formData.title.trim()) {
      errors.push('프로젝트 제목을 입력해주세요.');
    } else if (formData.title.length > 200) {
      errors.push('프로젝트 제목은 200자 이하로 입력해주세요.');
    }
    
    // 설명 검증
    if (!formData.description.trim()) {
      errors.push('프로젝트 설명을 입력해주세요.');
    } else if (formData.description.length > 2000) {
      errors.push('프로젝트 설명은 2000자 이하로 입력해주세요.');
    }
    
    // 기술스택 검증
    if (formData.techStacks.length === 0) {
      errors.push('최소 1개 이상의 기술스택을 선택해주세요.');
    } else if (formData.techStacks.length > 10) {
      errors.push('기술스택은 최대 10개까지만 선택할 수 있습니다.');
    } else {
      // 각 기술스택 개별 검증
      for (const tech of formData.techStacks) {
        if (!tech.trim()) {
          errors.push('빈 기술스택이 포함되어 있습니다.');
          break;
        }
        if (tech.length > 30) {
          errors.push(`'${tech}' 기술스택명이 30자를 초과했습니다.`);
          break;
        }
        if (!/^[\w.+#-]+$/.test(tech)) {
          errors.push(`'${tech}' 기술스택명에 허용되지 않는 문자가 포함되어 있습니다.`);
          break;
        }
      }
    }
    
    // 팀 크기 검증
    if (formData.teamSize < 1) {
      errors.push('팀 크기는 최소 1명 이상이어야 합니다.');
    }
    
    // 프로젝트 기간 검증
    if (formData.durationWeeks < 1) {
      errors.push('프로젝트 기간은 최소 1주 이상이어야 합니다.');
    }
    
    return errors;
  };

  /**
   * 📊 프로젝트 기간 옵션
   * 
   * 📝 기능: 사용자가 선택할 수 있는 프로젝트 기간 옵션
   */
  const durationOptions = [
    { value: 1, label: '1주' },
    { value: 2, label: '2주' },
    { value: 4, label: '4주 (1개월)' },
    { value: 8, label: '8주 (2개월)' },
    { value: 12, label: '12주 (3개월)' },
    { value: 24, label: '24주 (6개월)' },
    { value: 52, label: '52주 (1년)' }
  ];

  /**
   * 🎯 프로젝트 생성 제출 함수
   * 
   * 📡 백엔드 API: POST /projects
   * 🏠 컨트롤러: ProjectController.create(@RequestBody ProjectCreateRequest)
   * 📦 요청: { userId, title, description, techStack, teamSize, durationWeeks }
   * 🗂 파일: api/project.ts > createProject() 함수 사용
   */
  const handleSubmit = async () => {
    // 유효성 검사
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      alert('입력 오류:\n' + validationErrors.join('\n'));
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 🔗 api/project.ts에서 import한 createProject() 호출
      const projectData = {
        userId: user!.id,                                          // AuthContext에서 가져온 사용자 ID
        title: formData.title.trim(),                             // 프로젝트 제목
        description: formData.description.trim(),                 // 프로젝트 설명
        techStacks: formData.techStacks,                          // 기술스택 배열을 직접 전송
        teamSize: formData.teamSize,                              // 팀 크기
        durationWeeks: formData.durationWeeks                     // 프로젝트 기간
      };
      
      console.log('📤 프로젝트 생성 요청 데이터:', projectData);
      
      const result = await createProject(projectData);
      
      console.log('✅ 프로젝트 생성 성공:', result);
      alert('프로젝트가 성공적으로 생성되었습니다!');
      
      // 생성된 프로젝트 상세 페이지로 이동
      router.push(`/projects/${result.id}`);
      
    } catch (error) {
      console.error('❌ 프로젝트 생성 실패:', error);
      
      // 🎯 에러 상세 정보 로깅 (개발자용)
      if (error instanceof Error) {
        console.error('에러 메시지:', error.message);
        setError(error.message);
      } else {
        setError('프로젝트 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
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
              프로젝트를 생성하려면 먼저 로그인해주세요.
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
    <div className="min-h-screen">
      {/* 헤더 */}
      <header className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                취소
              </Link>
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                로그인됨: {user?.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            새 프로젝트 만들기
          </h1>
          <p className="text-muted-foreground">
            프로젝트 정보를 입력하고 팀원들과 함께할 프로젝트를 시작하세요!
          </p>
        </div>

        {/* 에러 메시지 표시 */}
        {error && (
          <div className="mb-6 p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* 폼 컨테이너 */}
        <Card>
          <CardContent className="p-8">
            <div className="space-y-8">
              
              {/* ============================================ */}
              {/* 📝 프로젝트 기본 정보 섹션 */}
              {/* ============================================ */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">프로젝트 기본 정보</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {/* 프로젝트 제목 */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-medium">
                      프로젝트 제목 *
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="예: DevMatch - 개발자 매칭 플랫폼"
                      maxLength={200}
                      className="text-lg"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.title.length}/200자
                    </p>
                  </div>
                  
                  {/* 프로젝트 설명 */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-medium">
                      프로젝트 설명 *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="프로젝트의 목표와 주요 기능을 간단히 설명해주세요. 팀원들이 프로젝트를 이해할 수 있도록 작성해주세요."
                      rows={5}
                      maxLength={2000}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.description.length}/2000자
                    </p>
                  </div>
                </div>
              </div>

              {/* ============================================ */}
              {/* 🎯 기술스택 선택 섹션 */}
              {/* ============================================ */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Code2 className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">기술스택 선택</h2>
                </div>
                
                <div className="space-y-4">
                  {/* 기술스택 입력 */}
                  <div className="space-y-2">
                    <Label htmlFor="techStackInput" className="text-base font-medium">
                      기술스택 추가 *
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="techStackInput"
                        type="text"
                        value={techStackInput}
                        onChange={(e) => setTechStackInput(e.target.value)}
                        onKeyPress={handleTechStackKeyPress}
                        placeholder="예: React, Spring Boot, MySQL..."
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        onClick={addTechStack}
                        disabled={!techStackInput.trim()}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        추가
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter 키를 누르거나 추가 버튼을 클릭하여 기술스택을 추가하세요. (영문, 숫자, _.+#- 문자만 허용, 최대 30자, 10개까지)
                    </p>
                  </div>
                  
                  {/* 추가된 기술스택 목록 */}
                  {formData.techStacks.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-base font-medium">
                        선택된 기술스택 ({formData.techStacks.length}개)
                      </Label>
                      <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-muted/50">
                        {formData.techStacks.map((tech, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="px-3 py-1 text-sm flex items-center gap-2"
                          >
                            {tech}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTechStack(tech)}
                              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {formData.techStacks.length === 0 && (
                    <div className="p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
                      <Code2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">
                        아직 기술스택이 추가되지 않았습니다.<br/>
                        위에서 기술스택을 추가해주세요.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ============================================ */}
              {/* 👥 팀 구성 및 일정 섹션 */}
              {/* ============================================ */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">팀 구성 및 일정</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 팀 크기 설정 */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">
                      목표 팀 크기 *
                    </Label>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          teamSize: Math.max(1, prev.teamSize - 1)
                        }))}
                        disabled={formData.teamSize <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">
                          {formData.teamSize}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          명
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          teamSize: prev.teamSize + 1
                        }))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      프로젝트 리더(본인) 포함 총 팀원 수
                    </p>
                  </div>
                  
                  {/* 프로젝트 기간 설정 */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">
                      프로젝트 기간 *
                    </Label>
                    <Select 
                      value={formData.durationWeeks.toString()} 
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        durationWeeks: parseInt(value)
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="기간을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      예상 프로젝트 완료 기간
                    </p>
                  </div>
                </div>
              </div>

              {/* ============================================ */}
              {/* 📋 프로젝트 생성 버튼 섹션 */}
              {/* ============================================ */}
              <div className="pt-6 border-t">
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      프로젝트 생성 중...
                    </>
                  ) : (
                    <>
                      <Target className="mr-2 h-5 w-5" />
                      프로젝트 생성하기
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ============================================ */}
        {/* 📊 프로젝트 미리보기 카드 */}
        {/* ============================================ */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              프로젝트 미리보기
            </CardTitle>
            <CardDescription>
              입력한 정보를 확인해보세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">프로젝트 제목</p>
                  <p className="font-semibold">{formData.title || '미입력'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">팀 크기</p>
                  <p className="font-semibold">{formData.teamSize}명</p>
                </div>
              </div>
              
              {/* 설명 */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">프로젝트 설명</p>
                <p className="text-sm">
                  {formData.description || '미입력'}
                </p>
              </div>
              
              {/* 기술스택과 기간 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">기술스택</p>
                  {formData.techStacks.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {formData.techStacks.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">미선택</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">프로젝트 기간</p>
                  <p className="font-semibold">
                    {durationOptions.find(opt => opt.value === formData.durationWeeks)?.label || '미선택'}
                  </p>
                </div>
              </div>
              
              {/* 백엔드 전송 데이터 미리보기 */}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-2">백엔드 전송 데이터</p>
                <pre className="text-xs text-muted-foreground">
                  {JSON.stringify({
                    userId: user?.id || 'USER_ID',
                    title: formData.title || 'TITLE',
                    description: formData.description || 'DESCRIPTION',
                    techStacks: formData.techStacks.length > 0 ? formData.techStacks : ['TECH_STACKS'],
                    teamSize: formData.teamSize,
                    durationWeeks: formData.durationWeeks
                  }, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );

}