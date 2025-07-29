'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { userApi } from '@/lib/api';
import { UserProjectListResponse } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function MyProjectsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [projects, setProjects] = useState<UserProjectListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserProjects();
    }
  }, [user]);

  const fetchUserProjects = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userProjects = await userApi.getUserProjects(user.id);
      setProjects(userProjects);
    } catch (err) {
      console.error('사용자 프로젝트 조회 실패:', err);
      setError('프로젝트 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>내 프로젝트</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">프로젝트를 조회하려면 로그인이 필요합니다.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <div className="container mx-auto py-8">로딩 중...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">내 프로젝트</h1>
        <Button onClick={() => router.push('/projects/create')}>
          새 프로젝트 생성
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500 mb-4">생성한 프로젝트가 없습니다.</p>
            <Button onClick={() => router.push('/projects/create')}>
              프로젝트 생성하기
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
