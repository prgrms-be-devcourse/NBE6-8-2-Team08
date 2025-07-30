'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { projectApi } from '@/lib/api';
import { ProjectCreateRequest } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function CreateProjectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    teamSize: '',
    durationWeeks: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      setIsLoading(true);
      
      const requestData: ProjectCreateRequest = {
        userId: user.id,
        title: formData.title,
        description: formData.description,
        techStack: formData.techStack,
        teamSize: parseInt(formData.teamSize),
        durationWeeks: parseInt(formData.durationWeeks),
      };

      const newProject = await projectApi.createProject(requestData);
      console.log('프로젝트 생성 성공:', newProject);
      
      alert('프로젝트가 성공적으로 생성되었습니다!');
      router.push(`/projects/${newProject.id}`);
    } catch (error) {
      console.error('프로젝트 생성 실패:', error);
      alert('프로젝트 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">새 프로젝트 생성</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">프로젝트 제목</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="프로젝트 제목을 입력하세요"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">프로젝트 설명</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="프로젝트에 대한 자세한 설명을 입력하세요"
                required
                rows={5}
              />
            </div>

            <div>
              <Label htmlFor="techStack">기술 스택</Label>
              <Input
                id="techStack"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                placeholder="기술 스택을 쉼표로 구분하여 입력하세요 (예: React, Node.js, MongoDB)"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teamSize">팀원 수</Label>
                <Input
                  id="teamSize"
                  name="teamSize"
                  type="number"
                  value={formData.teamSize}
                  onChange={handleChange}
                  placeholder="필요한 팀원 수"
                  required
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="durationWeeks">예상 기간 (주)</Label>
                <Input
                  id="durationWeeks"
                  name="durationWeeks"
                  type="number"
                  value={formData.durationWeeks}
                  onChange={handleChange}
                  placeholder="예상 진행 기간 (주)"
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '생성 중...' : '프로젝트 생성'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
