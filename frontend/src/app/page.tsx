'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { projectApi, userApi } from '@/lib/api';
import { ProjectDetailResponse, UserProjectListResponse, UserApplicationListResponse } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectDetailResponse[]>([]);
  const [userProjects, setUserProjects] = useState<UserProjectListResponse[]>([]);
  const [userApplications, setUserApplications] = useState<UserApplicationListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
    if (user) {
      fetchUserProjects();
      fetchUserApplications();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const allProjects = await projectApi.getAllProjects();
      setProjects(allProjects);
    } catch (err) {
      console.error('프로젝트 목록 조회 실패:', err);
      setError('프로젝트 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProjects = async () => {
    if (!user) return;
    try {
      const projects = await userApi.getUserProjects(user.id);
      setUserProjects(projects);
    } catch (err) {
      console.error('사용자 프로젝트 목록 조회 실패:', err);
    }
  };

  const fetchUserApplications = async () => {
    if (!user) return;
    try {
      const applications = await userApi.getUserApplications(user.id);
      setUserApplications(applications);
    } catch (err) {
      console.error('사용자 지원서 목록 조회 실패:', err);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8">로딩 중...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">개발자 프로젝트 매칭 플랫폼</h1>
        <p className="text-xl text-gray-600 mb-8">함께 작업할 팀원을 찾고 프로젝트를 성공적으로 완료하세요</p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/projects">프로젝트 둘러보기</Link>
          </Button>
          {user ? (
            <Button asChild size="lg" variant="outline">
              <Link href="/projects/create">프로젝트 생성</Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="outline">
              <Link href="/auth/login">로그인</Link>
            </Button>
          )}
        </div>
      </div>

      {user && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">내 활동</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>내 프로젝트</CardTitle>
              </CardHeader>
              <CardContent>
                {userProjects.length === 0 ? (
                  <p className="text-gray-500">생성한 프로젝트가 없습니다.</p>
                ) : (
                  <div className="space-y-4">
                    {userProjects.slice(0, 3).map((project) => (
                      <div key={project.id} className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{project.title}</h3>
                          <p className="text-sm text-gray-500">{project.currentTeamSize}/{project.teamSize}명</p>
                        </div>
                        <Badge variant={project.status === 'RECRUITING' ? 'default' : 'secondary'}>
                          {project.status === 'RECRUITING' ? '모집중' : project.status === 'IN_PROGRESS' ? '진행중' : '완료'}
                        </Badge>
                      </div>
                    ))}
                    {userProjects.length > 3 && (
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/projects/my-projects">더보기</Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>내 지원서</CardTitle>
              </CardHeader>
              <CardContent>
                {userApplications.length === 0 ? (
                  <p className="text-gray-500">제출한 지원서가 없습니다.</p>
                ) : (
                  <div className="space-y-4">
                    {userApplications.slice(0, 3).map((application) => (
                      <div key={application.applicationId} className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">프로젝트</h3>
                          <p className="text-sm text-gray-500">{new Date(application.appliedAt).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={application.status === 'PENDING' ? 'default' : 'secondary'}>
                          {application.status === 'PENDING' ? '대기중' : application.status}
                        </Badge>
                      </div>
                    ))}
                    {userApplications.length > 3 && (
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/applications/my-applications">더보기</Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">최신 프로젝트</h2>
          <Button asChild variant="outline">
            <Link href="/projects">더보기</Link>
          </Button>
        </div>
        {projects.length === 0 ? (
          <p className="text-center text-gray-500">등록된 프로젝트가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
