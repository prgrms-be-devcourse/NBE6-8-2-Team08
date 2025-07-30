'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  projectApi, 
  applicationApi, 
  userApi
} from '@/lib/api';

import { 
  ProjectDetailResponse, 
  UserApplicationListResponse, 
  ApplicationDetailResponse,
  User
} from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [project, setProject] = useState<ProjectDetailResponse | null>(null);
  const [applications, setApplications] = useState<UserApplicationListResponse[]>([]);
  const [userApplication, setUserApplication] = useState<ApplicationDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projectData, applicationsData] = await Promise.all([
        projectApi.getProject(Number(id)),
        projectApi.getProjectApplications(Number(id))
      ]);
      
      setProject(projectData);
      setApplications(applicationsData);
      
      // 현재 사용자의 지원서가 있는지 확인
      if (user) {
        const userApp = applicationsData.find(app => app.user.id === user.id);
        if (userApp) {
          const appDetails = await applicationApi.getApplication(userApp.applicationId);
          setUserApplication(appDetails);
        }
      }
    } catch (err) {
      console.error('프로젝트 데이터 조회 실패:', err);
      setError('프로젝트 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user || !project) return;
    
    try {
      setIsApplying(true);
      // 실제 구현 시 사용자의 기술 스택과 점수를 입력받아야 함
      const mockTechStacks = ['JavaScript', 'React'];
      const mockTechScores = [8, 7];
      
      const newApplication = await projectApi.applyToProject(project.id, {
        userId: user.id,
        techStacks: mockTechStacks.join(','),
        techScores: mockTechScores
      });



      
      setUserApplication(newApplication);
      // 지원서 목록 새로고침
      const updatedApplications = await projectApi.getProjectApplications(project.id);
      setApplications(updatedApplications);
    } catch (err) {
      console.error('프로젝트 지원 실패:', err);
      alert('프로젝트 지원에 실패했습니다.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleDeleteApplication = async () => {
    if (!userApplication) return;
    
    try {
      setIsDeleting(true);
      await applicationApi.deleteApplication(userApplication.applicationId);
      setUserApplication(null);
      // 지원서 목록 새로고침
      if (project) {
        const updatedApplications = await projectApi.getProjectApplications(project.id);
        setApplications(updatedApplications);
      }
    } catch (err) {
      console.error('지원서 삭제 실패:', err);
      alert('지원서 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    
    if (confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
      try {
        await projectApi.deleteProject(project.id);
        router.push('/projects');
      } catch (err) {
        console.error('프로젝트 삭제 실패:', err);
        alert('프로젝트 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8">로딩 중...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 text-red-500">{error}</div>;
  }

  if (!project) {
    return <div className="container mx-auto py-8">프로젝트를 찾을 수 없습니다.</div>;
  }

  const isProjectOwner = user?.id === project.creator.id;
  const hasApplied = !!userApplication;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        {isProjectOwner && (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => router.push(`/projects/${project.id}/edit`)}>
              수정
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              삭제
            </Button>
          </div>
        )}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
              <p className="text-gray-600">생성자: {project.creator.nickname}</p>
            </div>
            <Badge variant={project.status === 'RECRUITING' ? 'default' : 'secondary'}>
              {project.status === 'RECRUITING' ? '모집중' : '모집완료'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">프로젝트 설명</h3>
              <p className="text-gray-700">{project.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">기술 스택</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStacks.map((tech, index) => (
                  <Badge key={index} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-gray-500">팀원 수</h4>
              <p className="text-lg">{project.currentTeamSize} / {project.teamSize}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-500">예상 기간</h4>
              <p className="text-lg">{project.durationWeeks}주</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-500">생성일</h4>
              <p className="text-lg">{new Date(project.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 역할 배분 및 분석 결과 */}
        <Card>
          <CardHeader>
            <CardTitle>역할 배분 및 분석 결과</CardTitle>
          </CardHeader>
          <CardContent>
            {project.content ? (
              <div className="prose max-w-none">
                <p>{project.content}</p>
              </div>
            ) : (
              <p className="text-gray-500">역할 배분 내용이 없습니다.</p>
            )}
          </CardContent>
        </Card>

        {/* 지원서 및 팀원 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>지원서 및 팀원 목록</CardTitle>
          </CardHeader>
          <CardContent>
            {!isProjectOwner && (
              <div className="mb-6">
                {hasApplied ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">이미 지원하셨습니다.</h3>
                      <p className="text-sm text-gray-600">상태: {userApplication?.status === 'PENDING' ? '대기중' : userApplication?.status}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleDeleteApplication}
                      disabled={isDeleting}
                    >
                      {isDeleting ? '취소 중...' : '지원 취소'}
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleApply} 
                    disabled={isApplying}
                    className="w-full"
                  >
                    {isApplying ? '지원 중...' : '프로젝트 지원하기'}
                  </Button>
                )}
              </div>
            )}
            
            <div className="space-y-4">
              <h3 className="font-medium">지원자 목록 ({applications.length})</h3>
              {applications.length > 0 ? (
                <div className="space-y-3">
                  {applications.map((application) => (
                    <div key={application.applicationId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="font-medium">
                            {application.user.nickname.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{application.user.nickname}</p>
                          <p className="text-sm text-gray-500">{application.user.username}</p>
                        </div>
                      </div>
                      <Badge variant={application.status === 'PENDING' ? 'default' : 'secondary'}>
                        {application.status === 'PENDING' ? '대기중' : application.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">아직 지원자가 없습니다.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
